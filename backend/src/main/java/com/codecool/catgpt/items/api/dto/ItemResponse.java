package com.codecool.catgpt.items.api.dto;

import com.codecool.catgpt.items.domain.*;

public record ItemResponse(
        Long id,
        String name,
        ItemCategory category,
        EffectResponse effect,
        int availableAmount
) {
    public static ItemResponse from(Item i) {
        return new ItemResponse(
                i.getId(),
                i.getName(),
                i.getCategory(),
                new EffectResponse(i.getEffect().getStat(), i.getEffect().getAmount()),
                i.getAvailableAmount()
        );
    }

    public record EffectResponse(StatType stat, int amount) {}
}
