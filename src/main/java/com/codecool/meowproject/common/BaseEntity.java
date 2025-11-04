package com.codecool.meowproject.common;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@MappedSuperclass
@Getter
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Version
    protected Long version;

    @CreationTimestamp
    @Column(updatable = false)
    protected Instant createdAt;

    @UpdateTimestamp
    protected Instant updatedAt;
}
