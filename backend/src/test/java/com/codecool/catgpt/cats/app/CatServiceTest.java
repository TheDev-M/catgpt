package com.codecool.catgpt.cats.app;

import com.codecool.catgpt.cats.api.dto.CatCreateRequest;
import com.codecool.catgpt.cats.api.dto.SourceMetrics;
import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.domain.Stats;
import com.codecool.catgpt.cats.infra.CatRepository;
import com.codecool.catgpt.users.domain.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CatServiceTest {

    @Mock
    CatRepository cats;

    @Mock
    StatsCalculator statsCalculator;

    @InjectMocks
    CatService service;

    @Test
    void create_shouldCreateAndSaveCat() {
        User owner = new User();
        Stats stats = new Stats(5, 5, 5);

        var req = new CatCreateRequest(
                "Luna",
                "Siamese",
                Set.of("Playful"),
                new SourceMetrics(1, 1, 1),
                "img"
        );

        when(statsCalculator.fromSourceMetrics(req.sourceMetrics()))
                .thenReturn(stats);

        when(cats.save(any(Cat.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Cat result = service.create(req, owner);

        assertThat(result.getName()).isEqualTo("Luna");
        assertThat(result.getBreed()).isEqualTo("Siamese");
        assertThat(result.getStats()).isEqualTo(stats);

        verify(cats).save(any(Cat.class));
    }
}
