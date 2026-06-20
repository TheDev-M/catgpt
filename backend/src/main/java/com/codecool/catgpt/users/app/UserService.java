package com.codecool.catgpt.users.app;

import com.codecool.catgpt.cats.app.CatService;
import com.codecool.catgpt.items.domain.StatType;
import com.codecool.catgpt.users.api.dto.UserLoginRequest;
import com.codecool.catgpt.users.api.dto.UserRegisterRequest;
import com.codecool.catgpt.users.domain.AuthProvider;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.infra.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final CatService catService;

    public User register(UserRegisterRequest req) {
        if (users.existsByUsername(req.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken.");
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
                        HttpStatus.UNAUTHORIZED, "Invalid username or password."
                ));

        if (user.getPasswordHash() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "This account uses Google sign-in. Please log in with Google."
            );
        }

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid username or password."
            );
        }

        recordVisit(user);
        return user;
    }

    /**
     * Finds the user matching the given Google account, or creates a new one
     * (with its starter cat) on first login. Mirrors the visit/health bookkeeping
     * done for password logins.
     */
    public User processOAuthLogin(String email, String displayName) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google account has no email.");
        }

        var existing = users.findByEmail(email);
        if (existing.isPresent()) {
            var user = existing.get();
            recordVisit(user);
            return user;
        }

        var user = User.builder()
                .username(generateUsernameFromEmail(email))
                .email(email)
                .authProvider(AuthProvider.GOOGLE)
                .passwordHash(null)
                .description(displayName)
                .lastVisit(null)
                .build();

        users.save(user);

        var catId = catService.createDefaultCatForUser(user);
        updateSelectedCat(user, catId);

        recordVisit(user);
        return user;
    }

    private void recordVisit(User user) {
        Instant now = Instant.now();
        Instant lastVisit = user.getLastVisit();
        boolean missedVisit = lastVisit == null || Duration.between(lastVisit, now).toHours() >= 1;

        if (missedVisit) {
            Long selectedCatId = user.getSelectedCatId();
            if (selectedCatId != null) {
                try {
                    catService.decrementStat(selectedCatId, StatType.HEALTH, user); // return value intentionally ignored
                } catch (Exception e) {
                    log.warn("Failed to decrease cat health on login for user {}: {}", user.getUsername(), e.getMessage());
                }
            }
        }

        user.setLastVisit(Instant.now());
    }

    private String generateUsernameFromEmail(String email) {
        String base = email.split("@")[0]
                .replaceAll("[^a-zA-Z0-9_]", "")
                .toLowerCase();

        if (base.isBlank()) {
            base = "cat-fan";
        }
        if (base.length() > 50) {
            base = base.substring(0, 50);
        }

        if (!users.existsByUsername(base)) {
            return base;
        }

        var random = new SecureRandom();
        String candidate;
        do {
            candidate = base + "-" + (1000 + random.nextInt(9000));
        } while (users.existsByUsername(candidate));

        return candidate;
    }

    @Transactional
    public void updateSelectedCat(User user, Long catId) {
        user.setSelectedCatId(catId);
        users.save(user);
    }

    public void updateNickname(User user, String nickname) {
        user.setNickname(nickname == null || nickname.isBlank() ? null : nickname.trim());
    }

    public void changePassword(User user, String currentPassword, String newPassword) {
        if (user.getPasswordHash() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This account uses Google sign-in. Password cannot be changed.");
        }
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect.");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
    }
}

