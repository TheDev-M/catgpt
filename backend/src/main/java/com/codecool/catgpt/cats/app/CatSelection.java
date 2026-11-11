package com.codecool.catgpt.cats.app;

import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.infra.CatRepository;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.infra.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Keeps a user's {@code selectedCatId} / {@code lastOwnCatId} pointers consistent.
 * <p>
 * Those columns are plain ids rather than foreign keys, so nothing at the database
 * level stops them from outliving the cat they point at. Every path that makes a cat
 * unavailable to a user — deletion, death, or a reclaimed borrow — goes through here.
 */
@Component
@RequiredArgsConstructor
public class CatSelection {

    private final CatRepository cats;
    private final UserRepository users;

    /**
     * Picks the cat a user should fall back to: the one they had selected before
     * borrowing, otherwise their starter cat, otherwise any cat they own.
     *
     * @param excludingCatId a cat to ignore (because it is being deleted or released), may be null
     * @return the fallback cat id, or null if the user has no other cat
     */
    public Long resolveFallback(User user, Long excludingCatId) {
        Long last = user.getLastOwnCatId();
        if (last != null && !last.equals(excludingCatId) && isOwnedBy(last, user)) {
            return last;
        }

        List<Cat> owned = cats.findAllByOwner(user).stream()
                .filter(c -> !c.getId().equals(excludingCatId))
                .toList();

        return owned.stream()
                .filter(Cat::isDefaultCat)
                .map(Cat::getId)
                .findFirst()
                .or(() -> owned.stream().map(Cat::getId).findFirst())
                .orElse(null);
    }

    /**
     * Drops every reference the given user holds to {@code catId}, re-pointing their
     * selection at a fallback cat so they are never left looking at a cat that is gone.
     */
    public void releaseReferences(User user, Long catId) {
        boolean changed = false;

        if (catId.equals(user.getLastOwnCatId())) {
            user.setLastOwnCatId(null);
            changed = true;
        }
        if (catId.equals(user.getSelectedCatId())) {
            user.setSelectedCatId(resolveFallback(user, catId));
            // The memo has served its purpose now that the selection is restored.
            user.setLastOwnCatId(null);
            changed = true;
        }

        if (changed) {
            users.save(user);
        }
    }

    private boolean isOwnedBy(Long catId, User user) {
        return cats.findById(catId)
                .map(c -> c.getOwner().getId().equals(user.getId()))
                .orElse(false);
    }
}
