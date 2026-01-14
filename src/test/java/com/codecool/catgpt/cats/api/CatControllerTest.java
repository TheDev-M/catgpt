package com.codecool.catgpt.cats.api;

import com.codecool.catgpt.cats.api.dto.CatCreateRequest;
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
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CatControllerTest {

    @Mock
    private CatService cats;

    @Mock
    private CurrentUser currentUser;

    @InjectMocks
    private CatController controller;

    private Cat sampleCat;

    @BeforeEach
    void setUp() {
        sampleCat = Cat.builder()
                .name("Luna")
                .breed("Siamese")
                .temperaments(Set.of("Playful"))
                .stats(new Stats(5, 6, 7))
                .image("img")
                .build();

        lenient().when(currentUser.get()).thenReturn(new User());
    }

    @Test
    void all_shouldReturnCats() {
        when(cats.getAllForOwner(any())).thenReturn(List.of(sampleCat));

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
        CatCreateRequest req = new CatCreateRequest(
                "Luna",
                "Siamese",
                Set.of("Playful"),
                null,
                "img"
        );

        when(cats.create(req, currentUser.get())).thenReturn(sampleCat);

        ResponseEntity<CatResponse> response = controller.create(req);

        CatResponse body = response.getBody();
        assertNotNull(body);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Luna", body.name());
    }

    @Test
    void decrementStat_validStat_returnsOk() {
        when(cats.decrementStat(eq(1L), eq(StatType.HUNGER), any())).thenReturn(sampleCat);

        ResponseEntity<?> response = controller.decrementStat(1L, "hunger");

        Object bodyObj = response.getBody();
        assertNotNull(bodyObj);
        assertInstanceOf(Map.class, bodyObj);

        Map<?, ?> body = (Map<?, ?>) bodyObj;
        assertEquals("ok", body.get("status"));
        assertTrue(body.containsKey("cat"));
    }

    @Test
    void decrementStat_invalidStat_returnsBadRequest() {
        ResponseEntity<?> response = controller.decrementStat(1L, "invalid");

        Object bodyObj = response.getBody();
        assertNotNull(bodyObj);
        assertInstanceOf(Map.class, bodyObj);

        Map<?, ?> body = (Map<?, ?>) bodyObj;
        assertEquals("Invalid stat: invalid", body.get("error"));
    }

    @Test
    void decrementStat_released_returnsReleased() {
        when(cats.decrementStat(anyLong(), any(), any())).thenReturn(null);

        ResponseEntity<?> response = controller.decrementStat(1L, "health");

        Object bodyObj = response.getBody();
        assertNotNull(bodyObj);
        assertInstanceOf(Map.class, bodyObj);

        Map<?, ?> body = (Map<?, ?>) bodyObj;
        assertEquals("released", body.get("status"));
    }

    @Test
    void useItem_shouldReturnUpdatedCat() {
        when(cats.applyItem(eq(1L), eq(2L), any(User.class))).thenReturn(sampleCat);

        CatResponse response = controller.use(1L, 2L);
        assertNotNull(response);
        assertEquals("Luna", response.name());
    }

    @Test
    void update_shouldRenameCat() {
        when(cats.rename(eq(1L), eq("Boci"), any())).thenReturn(sampleCat);

        CatResponse response = controller.update(1L, Map.of("name", "Boci"));
        assertNotNull(response);
        assertEquals("Luna", response.name());
    }

    @Test
    void delete_shouldCallService() {
        lenient().when(currentUser.get()).thenReturn(new User());
        doNothing().when(cats).delete(eq(1L), any(User.class));

        controller.delete(1L);

        verify(cats).delete(eq(1L), any(User.class));
    }
}
