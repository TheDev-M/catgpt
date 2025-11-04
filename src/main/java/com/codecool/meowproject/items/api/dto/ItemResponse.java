package com.codecool.meowproject.items.api.dto;

import com.codecool.meowproject.items.domain.*;

public record ItemResponse(
        Long id,
        String name,
        ItemCategory category,
        String icon,
        StatType stat,
        int amount,
        int availableAmount
) {
    public static ItemResponse from(Item i) {
        return new ItemResponse(
                i.getId(),
                i.getName(),
                i.getCategory(),
                i.getIcon(),
                i.getEffect().getStat(),
                i.getEffect().getAmount(),
                i.getAvailableAmount()
        );
    }
}
