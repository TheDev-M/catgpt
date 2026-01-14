package com.codecool.catgpt.items.domain;

import com.codecool.catgpt.common.BaseEntity;
import com.codecool.catgpt.users.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Item extends BaseEntity {

    @Column(nullable = false, length = 16)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ItemCategory category;

    @Embedded
    private Effect effect;

    @Column(nullable = false)
    private int availableAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    public void increaseOne() {
        availableAmount++;
    }

    public void consumeOne() {
        if (availableAmount <= 0)
            throw new IllegalStateException("Item out of stock");
        availableAmount--;
    }
}
