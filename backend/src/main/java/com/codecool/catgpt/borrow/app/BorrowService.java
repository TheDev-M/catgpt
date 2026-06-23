package com.codecool.catgpt.borrow.app;

import com.codecool.catgpt.borrow.api.dto.BorrowableCatResponse;
import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.infra.CatRepository;
import com.codecool.catgpt.friends.domain.Friendship;
import com.codecool.catgpt.friends.domain.FriendshipRepository;
import com.codecool.catgpt.friends.domain.FriendshipStatus;
import com.codecool.catgpt.sse.SseService;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.infra.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final CatRepository cats;
    private final FriendshipRepository friendships;
    private final UserRepository users;
    private final SseService sse;

    public List<BorrowableCatResponse> getFriendCats(User me, Long friendshipId) {
        Friendship friendship = getApprovedFriendship(me, friendshipId);
        User friend = getOtherUser(friendship, me);
        Long friendSelectedCatId = friend.getSelectedCatId();
        return cats.findAllByOwner(friend).stream()
                .map(cat -> BorrowableCatResponse.from(cat, friendSelectedCatId))
                .toList();
    }

    @Transactional
    public void borrowCat(User me, Long catId) {
        Cat cat = cats.findById(catId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found."));

        if (cat.getOwner().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot borrow your own cat.");
        }

        // Verify active friendship with the cat's owner
        friendships.findBetween(me, cat.getOwner())
                .filter(f -> f.getStatus() == FriendshipStatus.APPROVED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not friends with this cat's owner."));

        // Owner priority: cannot borrow if owner is actively using the cat
        if (cat.getId().equals(cat.getOwner().getSelectedCatId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The owner is currently using this cat.");
        }

        // First-come-first-served: cannot borrow if already borrowed
        if (cat.getBorrowedBy() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This cat is already borrowed by someone else.");
        }

        // Release any cat the borrower currently has borrowed
        cats.findAllByBorrowedBy(me).forEach(existing -> {
            existing.setBorrowedBy(null);
            existing.setBorrowedAt(null);
            cats.save(existing);
        });

        cat.setBorrowedBy(me);
        cat.setBorrowedAt(Instant.now());
        cats.save(cat);

        me.setSelectedCatId(catId);
        users.save(me);

        // Notify the owner that their cat was borrowed
        sse.send(cat.getOwner().getId(), "cat-borrow-update", "borrowed");
    }

    @Transactional
    public void returnCat(User me, Long catId) {
        Cat cat = cats.findByIdAndBorrowedBy(catId, me)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "You are not borrowing this cat."));

        cat.setBorrowedBy(null);
        cat.setBorrowedAt(null);
        cats.save(cat);

        if (catId.equals(me.getSelectedCatId())) {
            Long fallback = cats.findAllByOwner(me).stream()
                    .filter(c -> c.isDefaultCat())
                    .map(Cat::getId)
                    .findFirst()
                    .or(() -> cats.findAllByOwner(me).stream()
                            .map(Cat::getId)
                            .findFirst())
                    .orElse(null);
            me.setSelectedCatId(fallback);
            users.save(me);
        }

        // Notify the owner
        sse.send(cat.getOwner().getId(), "cat-borrow-update", "returned");
    }

    /**
     * Called when an owner selects one of their own cats that is currently borrowed.
     * The borrow is released and the borrower loses the cat.
     */
    @Transactional
    public void releaseBorrowIfOwner(User owner, Long catId) {
        Cat cat = cats.findById(catId).orElse(null);
        if (cat == null || !cat.getOwner().getId().equals(owner.getId())) return;
        if (cat.getBorrowedBy() == null) return;

        User borrower = cat.getBorrowedBy();
        cat.setBorrowedBy(null);
        cat.setBorrowedAt(null);
        cats.save(cat);

        if (catId.equals(borrower.getSelectedCatId())) {
            Long fallback = cats.findAllByOwner(borrower).stream()
                    .filter(c -> c.isDefaultCat())
                    .map(Cat::getId)
                    .findFirst()
                    .or(() -> cats.findAllByOwner(borrower).stream()
                            .map(Cat::getId)
                            .findFirst())
                    .orElse(null);
            borrower.setSelectedCatId(fallback);
            users.save(borrower);
        }

        // Notify the borrower that they lost the cat
        sse.send(borrower.getId(), "cat-borrow-update", "reclaimed");
    }

    private Friendship getApprovedFriendship(User me, Long friendshipId) {
        Friendship f = friendships.findById(friendshipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friendship not found."));
        boolean involved = f.getRequester().getId().equals(me.getId())
                || f.getReceiver().getId().equals(me.getId());
        if (!involved) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not part of this friendship.");
        }
        if (f.getStatus() != FriendshipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are not friends yet.");
        }
        return f;
    }

    private User getOtherUser(Friendship f, User me) {
        return f.getRequester().getId().equals(me.getId()) ? f.getReceiver() : f.getRequester();
    }
}
