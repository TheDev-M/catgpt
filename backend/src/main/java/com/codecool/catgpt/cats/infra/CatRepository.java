package com.codecool.catgpt.cats.infra;

import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.users.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CatRepository extends JpaRepository<Cat, Long> {

    /**
     * Temperaments and borrowedBy are both mapped lazily but are read by every
     * response DTO, so they are fetched up front to avoid an N+1 per cat.
     */
    @EntityGraph(attributePaths = {"temperaments", "borrowedBy"})
    List<Cat> findAllByOwner(User owner);

    @EntityGraph(attributePaths = {"temperaments", "borrowedBy"})
    Optional<Cat> findWithDetailsById(Long id);

    boolean existsByOwnerAndNameIgnoreCase(User owner, String name);

    List<Cat> findAllByBorrowedBy(User borrower);

    Optional<Cat> findByIdAndBorrowedBy(Long id, User borrower);
}
