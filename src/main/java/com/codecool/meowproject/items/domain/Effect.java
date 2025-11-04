package com.codecool.meowproject.items.domain;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Effect {
    @Enumerated(EnumType.STRING)
    @Column(name = "stat", nullable = false, length = 16)
    private StatType stat;

    @Column(name = "amount", nullable = false)
    private int amount;
}
