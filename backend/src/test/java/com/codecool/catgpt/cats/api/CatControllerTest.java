package com.codecool.catgpt.cats.api;

import com.codecool.catgpt.cats.api.dto.CatCreateRequest;
import com.codecool.catgpt.cats.api.dto.CatRenameRequest;
import com.codecool.catgpt.cats.api.dto.CatResponse;
import com.codecool.catgpt.cats.app.CatService;
import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.domain.Stats;
import com.codecool.catgpt.items.domain.StatType;
import com.codecool.catgpt.security.CurrentUser;
import com.codecool.catgpt.users.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CatControllerTest {

    @Mock private CatService cats;
    @Mock private CurrentUser currentUser;
    @InjectMocks private CatController controller;

    private Cat sampleCat;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleCat = Cat.builder()
                .name("Luna")
                .breed("Siamese")
                .temperaments(Set.of("Playful"))
                .stats(new Stats(5, 6, 7))
                .image("img")
                .defaultCat(false)
                .build();

        lenient().when(currentUser.get()).thenReturn(sampleUser);
    }

    @Test
    void all_shouldReturnCats() {
        when(cats.getAllForOwner(sampleUser)).thenReturn(List.of(sampleCat));

        Iterable<CatResponse> result = controller.all();

        List<CatResponse> list = (List<CatResponse>) result;
        assertEquals(1, list.size());
        assertEquals("Luna", list.getFirst().name());
    }

    @Test
    void get_shouldReturnSingleCat() {
        when(cats.get(1L)).thenReturn(sampleCat);

        CatResponse response = controller.get(1L);

        assertNotNull(response);
        assertEquals("Luna", response.name());
        assertEquals("Siamese", response.breed());
    }

    @Test
    void create_shouldReturnCreatedCat() {
        var req = new CatCreateRequest("Luna", "Siamese", Set.of("Playful"), null, "img");
        when(cats.create(req, sampleUser)).thenReturn(sampleCat);

        ResponseEntity<CatResponse> response = controller.create(req);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Luna", response.getBody().name());
    }

    @Test
    void decrementStat_validStat_returnsOk() {
        when(cats.decrementStat(1L, StatType.HUNGER, sampleUser)).thenReturn(Optional.of(sampleCat));

        ResponseEntity<?> response = controller.decrementStat(1L, "hunger");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertNotNull(body);
        assertEquals("ok", body.get("status"));
        assertTrue(body.containsKey("cat"));
    }

    @Test
    void decrementStat_catReleased_returnsReleasedStatus() {
        when(cats.decrementStat(1L, StatType.HEALTH, sampleUser)).thenReturn(Optional.empty());

        ResponseEntity<?> response = controller.decrementStat(1L, "health");

        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertNotNull(body);
        assertEquals("released", body.get("status"));
    }

    @Test
    void decrementStat_invalidStat_throwsIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> controller.decrementStat(1L, "invalid"));
    }

    @Test
    void update_shouldRenameCat() {
        when(cats.rename(1L, "Boci", sampleUser)).thenReturn(sampleCat);

        CatResponse response = controller.update(1L, new CatRenameRequest("Boci"));

        assertNotNull(response);
        assertEquals("Luna", response.name());
    }

    @Test
    void useItem_shouldReturnUpdatedCat() {
        when(cats.applyItem(1L, 2L, sampleUser)).thenReturn(sampleCat);

        CatResponse response = controller.use(1L, 2L);

        assertNotNull(response);
        assertEquals("Luna", response.name());
    }

    @Test
    void delete_shouldDelegateToService() {
        doNothing().when(cats).delete(1L, sampleUser);

        controller.delete(1L);

        verify(cats).delete(1L, sampleUser);
    }
}
