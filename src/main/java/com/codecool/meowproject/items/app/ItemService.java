package com.codecool.meowproject.items.app;

import com.codecool.meowproject.items.domain.Item;
import com.codecool.meowproject.items.infra.ItemRepository;
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

    public Item getEntity(Long id) {
        return items.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));
    }

    public List<Item> getAll() {
        return items.findAll();
    }

    public Item create(Item item) {
        return items.save(item);
    }
}
