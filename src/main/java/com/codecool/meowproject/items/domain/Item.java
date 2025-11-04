package com.codecool.meowproject.items.domain;

import com.codecool.meowproject.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Item extends BaseEntity {

    @Column(nullable = false, length = 64, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ItemCategory category;

    @Column(length = 256)
    private String icon;

    @Embedded
    private Effect effect;

    @Column(nullable = false)
    private int availableAmount;

    public void consumeOne() {
        if (availableAmount <= 0)
            throw new IllegalStateException("Item out of stock");
        availableAmount--;
    }
}
