package com.codecool.catgpt.items.api.dto;

import com.codecool.catgpt.items.domain.StatType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ItemCreateRequestTest {

    @Test
    void shouldStoreFieldsCorrectly() {
        ItemCreateRequest.EffectRequest effect = new ItemCreateRequest.EffectRequest(StatType.HEALTH, 2);
        ItemCreateRequest req = new ItemCreateRequest("Wipes", null, effect, 5);

        assertEquals("Wipes", req.name());
        assertEquals(effect, req.effect());
        assertEquals(5, req.availableAmount());
        assertEquals(2, req.effect().amount());
        assertEquals(StatType.HEALTH, req.effect().stat());
    }
}
