package com.codecool.catgpt.cats.domain;

import com.codecool.catgpt.common.BaseEntity;
import com.codecool.catgpt.common.StatsLimits;
import com.codecool.catgpt.items.domain.Item;
import com.codecool.catgpt.users.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;
import java.util.TreeSet;

@Entity
@Table(name = "cats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cat extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, length = 64)
    private String breed;

    @ElementCollection
    @CollectionTable(name = "cat_temperaments", joinColumns = @JoinColumn(name = "cat_id"))
    @Column(name = "temperament", nullable = false, length = 32)
    @Builder.Default
    private Set<String> temperaments = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

    @Embedded
    private Stats stats;

    @Column(columnDefinition = "text")
    private String image;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private boolean defaultCat;

    public void apply(Item item, StatsLimits limits) {
        this.stats = this.stats.apply(item.getEffect(), limits);
    }
}
