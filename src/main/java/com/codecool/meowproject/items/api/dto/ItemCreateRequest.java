package com.codecool.meowproject.items.api.dto;

import com.codecool.meowproject.items.domain.ItemCategory;
import com.codecool.meowproject.items.domain.StatType;

public record ItemCreateRequest(
        String name,
        ItemCategory category,
        String icon,
        StatType stat,
        int amount,
        int availableAmount
) {}
