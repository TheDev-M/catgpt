package com.codecool.catgpt.items.infra;

import com.codecool.catgpt.items.domain.Item;
import com.codecool.catgpt.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findAllByOwner(User owner);
    Optional<Item> findByOwnerAndName(User owner, String name);
}
