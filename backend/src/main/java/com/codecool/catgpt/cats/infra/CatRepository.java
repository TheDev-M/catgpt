package com.codecool.catgpt.cats.infra;

import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatRepository extends JpaRepository<Cat, Long> {

    List<Cat> findAllByOwner(User owner);
}
