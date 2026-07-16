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

    @Column
    private String passwordHash;

    @Column(unique = true, length = 320)
    private String email;

    @Builder.Default
    @Column(nullable = false, length = 16)
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(length = 512)
    private String description;

    @Column(length = 64)
    private String nickname;

    @Column
    private Long selectedCatId;

    @Column
    private Long lastOwnCatId;

    private Instant lastVisit;
}
