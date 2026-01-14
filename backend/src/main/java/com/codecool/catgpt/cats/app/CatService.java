package com.codecool.catgpt.cats.app;

import com.codecool.catgpt.cats.api.dto.CatCreateRequest;
import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.domain.Stats;
import com.codecool.catgpt.cats.infra.CatRepository;
import com.codecool.catgpt.common.StatsLimits;
import com.codecool.catgpt.items.app.ItemService;
import com.codecool.catgpt.items.domain.StatType;
import com.codecool.catgpt.users.domain.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.TreeSet;

@Service
@Transactional
@RequiredArgsConstructor
public class CatService {
    private final CatRepository cats;
    private final ItemService items;
    private final StatsLimits limits;
    private final StatsCalculator statsCalculator;

    public List<Cat> getAllForOwner(User owner) {
        return cats.findAllByOwner(owner);
    }

    public Cat get(Long id) {
        return cats.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found"));
    }

    public Cat create(CatCreateRequest req, User owner) {
        validateUniqueNameForOwner(req.name(), owner);

        var stats = statsCalculator.fromSourceMetrics(req.sourceMetrics());

        return cats.save(Cat.builder()
                .name(req.name())
                .breed(req.breed())
                .temperaments(req.temperaments())
                .stats(stats)
                .image(req.image())
                .owner(owner)
                .defaultCat(false)
                .build());
    }

    public void delete(Long id, User owner) {
        var cat = getOwnedCat(id, owner);
        cats.delete(cat);
    }


    public Cat rename(Long id, String newName, User owner) {
        var cat = getOwnedCat(id, owner);

        if (!cat.getName().equalsIgnoreCase(newName)) {
            validateUniqueNameForOwner(newName, owner);
        }

        cat.setName(newName);
        return cat;
    }


    public Cat applyItem(Long catId, Long itemId, User owner) {
        var cat = getOwnedCat(catId, owner);
        var item = items.getOwnedItem(itemId, owner);

        if (item.getAvailableAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item out of stock");
        }

        cat.apply(item, limits);
        item.consumeOne();

        return cat;
    }


    public Cat decrementStat(Long id, StatType stat, User owner) {
        var cat = getOwnedCat(id, owner);

        if (stat == StatType.HEALTH
                && cat.isDefaultCat()
                && cat.getStats().getHealth() <= 5) {
            return cat;
        }

        var newStats = cat.getStats().decrement(stat);
        cat.setStats(newStats);

        if (newStats.getHealth() <= 0) {

            cats.delete(cat);
            return null;
        }

        return cat;
    }

    public Long createDefaultCatForUser(User owner) {
        var temps = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        temps.addAll(List.of("Affectionate", "Dependent", "Gentle", "Intelligent", "Playful"));

        var bob = Cat.builder()
                .name("Bob")
                .breed("Bombay")
                .temperaments(temps)
                .stats(new Stats(7, 9, 7))
                .image("https://upload.wikimedia.org/wikipedia/commons/a/ac/Bombay_femelle.JPG")
                .owner(owner)
                .defaultCat(true)
                .build();

        cats.save(bob);

        return bob.getId();
    }

    private Cat getOwnedCat(Long id, User owner) {
        var cat = cats.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found"));

        if (!cat.getOwner().equals(owner)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This cat does not belong to you");
        }

        return cat;
    }

    private void validateUniqueNameForOwner(String name, User owner) {
        boolean exists = cats.findAllByOwner(owner).stream()
                .anyMatch(cat -> cat.getName().equalsIgnoreCase(name));
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You already have a cat named " + name + ".");
        }
    }

}
