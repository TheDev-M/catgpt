package com.codecool.catgpt.friends.domain;

import com.codecool.catgpt.common.BaseEntity;
import com.codecool.catgpt.users.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "friendships",
    uniqueConstraints = @UniqueConstraint(columnNames = {"requester_id", "receiver_id"})
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Friendship extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private FriendshipStatus status = FriendshipStatus.PENDING;
}
