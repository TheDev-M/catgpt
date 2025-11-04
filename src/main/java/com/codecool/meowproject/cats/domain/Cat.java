package com.codecool.meowproject.cats.domain;

import com.codecool.meowproject.common.BaseEntity;
import com.codecool.meowproject.common.StatsLimits;
import com.codecool.meowproject.items.domain.Item;
import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "cats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cat extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, length = 64)
    private String breed;

    @ElementCollection(targetClass = Temperament.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "cat_temperaments", joinColumns = @JoinColumn(name = "cat_id"))
    @Column(name = "temperament", nullable = false, length = 32)
    private Set<Temperament> temperaments = new LinkedHashSet<>();

    @Embedded
    private Stats stats;

    @Column(columnDefinition = "text")
    private String image;

    /** Apply an item's effect to this cat respecting configured limits. */
    public void apply(Item item, StatsLimits limits) {
        this.stats = this.stats.apply(item.getEffect(), limits);
    }
}
