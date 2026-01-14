package com.codecool.catgpt.users.domain;

import com.codecool.catgpt.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 512)
    private String description;

    @Column
    private Long selectedCatId;

    private Instant lastVisit;
}
