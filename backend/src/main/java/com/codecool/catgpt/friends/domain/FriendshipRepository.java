package com.codecool.catgpt.friends.domain;

import com.codecool.catgpt.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("""
        SELECT f FROM Friendship f
        WHERE f.status = 'APPROVED'
          AND (f.requester = :user OR f.receiver = :user)
        """)
    List<Friendship> findApprovedFriendships(@Param("user") User user);

    @Query("""
        SELECT f FROM Friendship f
        WHERE f.status = 'PENDING'
          AND f.receiver = :user
        """)
    List<Friendship> findIncomingRequests(@Param("user") User user);

    @Query("""
        SELECT f FROM Friendship f
        WHERE f.status = 'PENDING'
          AND f.requester = :user
        """)
    List<Friendship> findOutgoingRequests(@Param("user") User user);

    @Query("""
        SELECT f FROM Friendship f
        WHERE (f.requester = :a AND f.receiver = :b)
           OR (f.requester = :b AND f.receiver = :a)
        """)
    Optional<Friendship> findBetween(@Param("a") User a, @Param("b") User b);
}
