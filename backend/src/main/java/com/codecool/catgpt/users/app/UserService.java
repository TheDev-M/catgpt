package com.codecool.catgpt.users.app;

import com.codecool.catgpt.cats.app.CatService;
import com.codecool.catgpt.items.domain.StatType;
import com.codecool.catgpt.users.api.dto.UserLoginRequest;
import com.codecool.catgpt.users.api.dto.UserRegisterRequest;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.infra.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final CatService catService;

    public User register(UserRegisterRequest req) {
        if (req.username() == null || req.username().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (req.password() == null || req.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        if (users.existsByUsername(req.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        var user = User.builder()
                .username(req.username().trim())
                .passwordHash(passwordEncoder.encode(req.password()))
                .description(req.description())
                .lastVisit(null)
                .build();

        users.save(user);

        var catId = catService.createDefaultCatForUser(user);
        updateSelectedCat(user, catId);

        return user;
    }

    public User authenticate(UserLoginRequest req) {
        var user = users.findByUsername(req.username())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password"
                ));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid username or password"
            );
        }

        Instant now = Instant.now();
        Instant lastVisit = user.getLastVisit();
        boolean shouldLoseHealth = false;

        if (lastVisit == null) {
            shouldLoseHealth = true;
        } else {
            var hours = Duration.between(lastVisit, now).toHours();
            if (hours >= 1) {
                shouldLoseHealth = true;
            }
        }

        if (shouldLoseHealth) {
            Long selectedCatId = user.getSelectedCatId();

            if (selectedCatId != null) {
                try {
                    catService.decrementStat(selectedCatId, StatType.HEALTH, user);
                } catch (Exception e) {
                    System.err.println("Failed to decrease cat health on login: " + e);
                }
            }
        }

        user.setLastVisit(Instant.now());
        return user;
    }

    @Transactional
    public void updateSelectedCat(User user, Long catId) {
        user.setSelectedCatId(catId);
        users.save(user);
    }
}

