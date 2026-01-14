package com.codecool.catgpt.items.api.dto;

import com.codecool.catgpt.items.domain.*;

public record ItemCreateRequest(
        String name,
        ItemCategory category,
        EffectRequest effect,
        int availableAmount
) {
    public record EffectRequest(StatType stat, int amount) {}
}
