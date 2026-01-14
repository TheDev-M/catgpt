package com.codecool.catgpt.items.app;

import com.codecool.catgpt.items.domain.*;
import com.codecool.catgpt.items.infra.ItemRepository;
import com.codecool.catgpt.users.domain.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository items;

    public List<Item> getAllForOwner(User owner) {
        return items.findAllByOwner(owner);
    }

    public Item create(Item item) {
        return items.save(item);
    }

    public Item catchItemForUser(String itemName, User owner) {
        var existing = items.findByOwnerAndName(owner, itemName);
        if (existing.isPresent()) {
            var item = existing.get();
            item.increaseOne();
            return item;
        }

        var template = ItemTemplate.fromName(itemName)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Unknown item: " + itemName
                ));

        var newItem = template.createOwnedItem(owner);
        return items.save(newItem);
    }

    public Item getOwnedItem(Long id, User owner) {
        var item = items.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        if (!item.getOwner().equals(owner)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Item does not belong to you");
        }

        return item;
    }
}
