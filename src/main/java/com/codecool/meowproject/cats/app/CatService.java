package com.codecool.meowproject.cats.app;

import com.codecool.meowproject.cats.domain.Cat;
import com.codecool.meowproject.cats.infra.CatRepository;
import com.codecool.meowproject.common.StatsLimits;
import com.codecool.meowproject.items.app.ItemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CatService {
    private final CatRepository cats;
    private final ItemService items;
    private final StatsLimits limits;

    public List<Cat> getAll() {
        return cats.findAll();
    }

    public Cat get(Long id) {
        return cats.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found"));
    }

    public Cat create(Cat cat) {
        return cats.save(cat);
    }

    public void delete(Long id) {
        if (!cats.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found");
        }
        cats.deleteById(id);
    }

    public Cat rename(Long id, String newName) {
        var cat = get(id);
        cat.setName(newName);
        return cat;
    }

    public Cat applyItem(Long catId, Long itemId) {
        var cat = get(catId);
        var item = items.getEntity(itemId);
        cat.apply(item, limits);
        item.consumeOne();
        return cat;
    }
}
