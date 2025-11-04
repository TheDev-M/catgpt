package com.codecool.meowproject.items.infra;

import com.codecool.meowproject.items.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {}
