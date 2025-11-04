package com.codecool.meowproject.common;

import com.codecool.meowproject.cats.domain.Cat;
import com.codecool.meowproject.cats.domain.Stats;
import com.codecool.meowproject.cats.domain.Temperament;
import com.codecool.meowproject.cats.infra.CatRepository;
import com.codecool.meowproject.items.domain.*;
import com.codecool.meowproject.items.infra.ItemRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final CatRepository catRepository;
    private final ItemRepository itemRepository;

    @PostConstruct
    public void seedData() {
        seedCats();
        seedItems();
    }

    private void seedCats() {
        if (catRepository.count() > 0) {
            System.out.println("🐱 Cats already seeded.");
            return;
        }

        Cat bob = Cat.builder()
                .name("Bob")
                .breed("Bombay")
                .temperaments(Set.of(
                        Temperament.AFFECTIONATE,
                        Temperament.DEPENDENT,
                        Temperament.GENTLE,
                        Temperament.INTELLIGENT,
                        Temperament.PLAYFUL
                ))
                .stats(new Stats(7, 9, 7))
                .image("https://upload.wikimedia.org/wikipedia/commons/a/ac/Bombay_femelle.JPG")
                .build();

        catRepository.save(bob);
        System.out.println("✅ Default cat created: " + bob.getName());
    }

    private void seedItems() {
        if (itemRepository.count() > 0) {
            System.out.println("📦 Items already seeded.");
            return;
        }

        List<Item> items = List.of(
                Item.builder()
                        .name("Water")
                        .category(ItemCategory.FOOD)
                        .icon("/icons/food/water.png")
                        .effect(new Effect(StatType.HUNGER, 1))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Dry food")
                        .category(ItemCategory.FOOD)
                        .icon("/icons/food/dryfood.png")
                        .effect(new Effect(StatType.HUNGER, 2))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Canned food")
                        .category(ItemCategory.FOOD)
                        .icon("/icons/food/cannedfood.png")
                        .effect(new Effect(StatType.HUNGER, 3))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Salmon")
                        .category(ItemCategory.FOOD)
                        .icon("/icons/food/salmon.png")
                        .effect(new Effect(StatType.HUNGER, 4))
                        .availableAmount(1)
                        .build(),

                Item.builder()
                        .name("Wipes")
                        .category(ItemCategory.HYGIENE)
                        .icon("/icons/hygiene/wipes.png")
                        .effect(new Effect(StatType.HEALTH, 1))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Litter")
                        .category(ItemCategory.HYGIENE)
                        .icon("/icons/hygiene/litter.png")
                        .effect(new Effect(StatType.HEALTH, 2))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Hairbrush")
                        .category(ItemCategory.HYGIENE)
                        .icon("/icons/hygiene/hairbrush.png")
                        .effect(new Effect(StatType.HEALTH, 3))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Toothbrush")
                        .category(ItemCategory.HYGIENE)
                        .icon("/icons/hygiene/toothbrush.png")
                        .effect(new Effect(StatType.HEALTH, 4))
                        .availableAmount(1)
                        .build(),

                Item.builder()
                        .name("Woolball")
                        .category(ItemCategory.TOY)
                        .icon("/icons/toy/woolball.png")
                        .effect(new Effect(StatType.MOOD, 1))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Mouse plush")
                        .category(ItemCategory.TOY)
                        .icon("/icons/toy/mouseplush.png")
                        .effect(new Effect(StatType.MOOD, 2))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Teaser wand")
                        .category(ItemCategory.TOY)
                        .icon("/icons/toy/teaserwand.png")
                        .effect(new Effect(StatType.MOOD, 3))
                        .availableAmount(1)
                        .build(),
                Item.builder()
                        .name("Laser pointer")
                        .category(ItemCategory.TOY)
                        .icon("/icons/toy/laserpointer.png")
                        .effect(new Effect(StatType.MOOD, 4))
                        .availableAmount(1)
                        .build()
        );

        itemRepository.saveAll(items);
        System.out.println("✅ Default items created (" + items.size() + ")");
    }
}
