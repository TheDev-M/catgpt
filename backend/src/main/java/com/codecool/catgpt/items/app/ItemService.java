package com.codecool.catgpt.items.app;

import com.codecool.catgpt.items.domain.*;
import com.codecool.catgpt.items.infra.ItemRepository;
import com.codecool.catgpt.users.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository items;

    @Transactional(readOnly = true)
    public List<Item> getAllForOwner(User owner) {
        return items.findAllByOwner(owner);
    }

    /**
     * Adds one of the named item to the user's bag. The item's category, icon and
     * effect all come from {@link ItemTemplate}, never from the caller.
     */
    public Item catchItemForUser(String itemName, User owner) {
        var template = ItemTemplate.fromName(itemName)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Unknown item: " + itemName + "."
                ));

        return items.findByOwnerAndName(owner, template.getDisplayName())
                .map(existing -> {
                    existing.increaseOne();
                    return existing;
                })
                .orElseGet(() -> items.save(template.createOwnedItem(owner)));
    }

    @Transactional(readOnly = true)
    public Item getOwnedItem(Long id, User owner) {
        var item = items.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found."));

        if (!item.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Item does not belong to you.");
        }

        return item;
    }
}
