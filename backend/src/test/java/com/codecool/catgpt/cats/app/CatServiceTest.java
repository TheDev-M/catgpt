package com.codecool.catgpt.cats.app;

import com.codecool.catgpt.cats.api.dto.CatCreateRequest;
import com.codecool.catgpt.cats.api.dto.SourceMetrics;
import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.domain.Stats;
import com.codecool.catgpt.cats.infra.CatRepository;
import com.codecool.catgpt.common.StatsLimits;
import com.codecool.catgpt.items.app.ItemService;
import com.codecool.catgpt.items.domain.Effect;
import com.codecool.catgpt.items.domain.Item;
import com.codecool.catgpt.items.domain.ItemCategory;
import com.codecool.catgpt.items.domain.StatType;
import com.codecool.catgpt.users.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CatServiceTest {

    @Mock private CatRepository cats;
    @Mock private ItemService items;
    @Mock private StatsLimits limits;
    @Mock private StatsCalculator statsCalculator;
    @InjectMocks private CatService service;

    private User owner;
    private Cat cat;

    @BeforeEach
    void setUp() {
        owner = new User();
        cat = Cat.builder()
                .name("Luna")
                .breed("Siamese")
                .temperaments(Set.of("Playful"))
                .stats(new Stats(5, 5, 5))
                .image("img")
                .owner(owner)
                .defaultCat(false)
                .build();
    }

    // --- create ---

    @Test
    void create_shouldSaveAndReturnCat() {
        var req = new CatCreateRequest("Luna", "Siamese", Set.of("Playful"), new SourceMetrics(1, 1, 1), "img");
        var stats = new Stats(5, 5, 5);

        when(cats.existsByOwnerAndNameIgnoreCase(owner, "Luna")).thenReturn(false);
        when(statsCalculator.fromSourceMetrics(req.sourceMetrics())).thenReturn(stats);
        when(cats.save(any(Cat.class))).thenAnswer(inv -> inv.getArgument(0));

        Cat result = service.create(req, owner);

        assertThat(result.getName()).isEqualTo("Luna");
        assertThat(result.getStats()).isEqualTo(stats);
        verify(cats).save(any(Cat.class));
    }

    @Test
    void create_duplicateName_shouldThrowBadRequest() {
        var req = new CatCreateRequest("Luna", "Siamese", Set.of(), new SourceMetrics(1, 1, 1), "img");

        when(cats.existsByOwnerAndNameIgnoreCase(owner, "Luna")).thenReturn(true);

        var ex = assertThrows(ResponseStatusException.class, () -> service.create(req, owner));
        assertThat(ex.getStatusCode().value()).isEqualTo(400);
    }

    // --- get ---

    @Test
    void get_existingCat_shouldReturn() {
        when(cats.findById(1L)).thenReturn(Optional.of(cat));

        Cat result = service.get(1L);

        assertThat(result).isSameAs(cat);
    }

    @Test
    void get_notFound_shouldThrow404() {
        when(cats.findById(99L)).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class, () -> service.get(99L));
        assertThat(ex.getStatusCode().value()).isEqualTo(404);
    }

    // --- delete ---

    @Test
    void delete_ownedCat_shouldDelete() {
        when(cats.findById(1L)).thenReturn(Optional.of(cat));

        service.delete(1L, owner);

        verify(cats).delete(cat);
    }

    @Test
    void delete_catOwnedByOther_shouldThrow403() {
        var otherOwner = new User();
        when(cats.findById(1L)).thenReturn(Optional.of(cat));

        var ex = assertThrows(ResponseStatusException.class, () -> service.delete(1L, otherOwner));
        assertThat(ex.getStatusCode().value()).isEqualTo(403);
    }

    // --- rename ---

    @Test
    void rename_newName_shouldUpdate() {
        when(cats.findById(1L)).thenReturn(Optional.of(cat));
        when(cats.existsByOwnerAndNameIgnoreCase(owner, "Whiskers")).thenReturn(false);

        Cat result = service.rename(1L, "Whiskers", owner);

        assertThat(result.getName()).isEqualTo("Whiskers");
    }

    @Test
    void rename_sameName_shouldNotCheckDuplicate() {
        when(cats.findById(1L)).thenReturn(Optional.of(cat));

        service.rename(1L, "luna", owner);

        verify(cats, never()).existsByOwnerAndNameIgnoreCase(any(), any());
    }

    @Test
    void rename_duplicateName_shouldThrowBadRequest() {
        when(cats.findById(1L)).thenReturn(Optional.of(cat));
        when(cats.existsByOwnerAndNameIgnoreCase(owner, "Bob")).thenReturn(true);

        var ex = assertThrows(ResponseStatusException.class, () -> service.rename(1L, "Bob", owner));
        assertThat(ex.getStatusCode().value()).isEqualTo(400);
    }

    // --- applyItem ---

    @Test
    void applyItem_validItem_shouldApplyAndConsume() {
        var item = Item.builder()
                .name("Salmon")
                .category(ItemCategory.FOOD)
                .effect(new Effect(StatType.HUNGER, 4))
                .availableAmount(2)
                .owner(owner)
                .build();

        when(cats.findById(1L)).thenReturn(Optional.of(cat));
        when(items.getOwnedItem(2L, owner)).thenReturn(item);
        when(limits.maxHunger()).thenReturn(10);

        service.applyItem(1L, 2L, owner);

        assertThat(item.getAvailableAmount()).isEqualTo(1);
    }

    @Test
    void applyItem_outOfStock_shouldThrowBadRequest() {
        var item = Item.builder()
                .name("Water")
                .category(ItemCategory.FOOD)
                .effect(new Effect(StatType.HUNGER, 1))
                .availableAmount(0)
                .owner(owner)
                .build();

        when(cats.findById(1L)).thenReturn(Optional.of(cat));
        when(items.getOwnedItem(2L, owner)).thenReturn(item);

        var ex = assertThrows(ResponseStatusException.class, () -> service.applyItem(1L, 2L, owner));
        assertThat(ex.getStatusCode().value()).isEqualTo(400);
    }

    // --- decrementStat ---

    @Test
    void decrementStat_hunger_shouldDecrementAndReturn() {
        when(cats.findById(1L)).thenReturn(Optional.of(cat));

        Optional<Cat> result = service.decrementStat(1L, StatType.HUNGER, owner);

        assertThat(result).isPresent();
        assertThat(result.get().getStats().getHunger()).isEqualTo(4);
    }

    @Test
    void decrementStat_healthReachesZero_shouldDeleteAndReturnEmpty() {
        cat.setStats(new Stats(5, 5, 1));
        when(cats.findById(1L)).thenReturn(Optional.of(cat));

        Optional<Cat> result = service.decrementStat(1L, StatType.HEALTH, owner);

        assertThat(result).isEmpty();
        verify(cats).delete(cat);
    }

    @Test
    void decrementStat_defaultCatHealthLow_shouldNotDecrement() {
        cat.setDefaultCat(true);
        cat.setStats(new Stats(5, 5, 5));
        when(cats.findById(1L)).thenReturn(Optional.of(cat));

        Optional<Cat> result = service.decrementStat(1L, StatType.HEALTH, owner);

        assertThat(result).isPresent();
        assertThat(result.get().getStats().getHealth()).isEqualTo(5);
        verify(cats, never()).delete(any());
    }

    // --- createDefaultCatForUser ---

    @Test
    void createDefaultCatForUser_shouldSaveBobAndReturnId() {
        when(cats.save(any(Cat.class))).thenAnswer(inv -> {
            Cat c = inv.getArgument(0);
            c.setName(c.getName()); // just return it
            return c;
        });

        Long id = service.createDefaultCatForUser(owner);

        verify(cats).save(argThat(c -> c.getName().equals("Bob") && c.isDefaultCat()));
    }
}
