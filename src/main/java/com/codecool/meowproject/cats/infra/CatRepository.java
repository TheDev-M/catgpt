package com.codecool.meowproject.cats.infra;

import com.codecool.meowproject.cats.domain.Cat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatRepository extends JpaRepository<Cat, Long> {}
