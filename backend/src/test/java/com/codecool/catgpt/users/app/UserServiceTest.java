package com.codecool.catgpt.users.app;

import com.codecool.catgpt.cats.app.CatService;
import com.codecool.catgpt.items.domain.StatType;
import com.codecool.catgpt.users.api.dto.UserLoginRequest;
import com.codecool.catgpt.users.api.dto.UserRegisterRequest;
import com.codecool.catgpt.users.domain.AuthProvider;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.infra.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository users;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private CatService catService;
    @InjectMocks private UserService service;

    private User existingUser;

    @BeforeEach
    void setUp() {
        existingUser = User.builder()
                .username("testuser")
                .passwordHash("hashed")
                .build();
    }

    // --- register ---

    @Test
    void register_newUser_shouldSaveAndReturnUser() {
        var req = new UserRegisterRequest("newuser", "pass123", null);

        when(users.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("hashed");
        when(users.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(catService.createDefaultCatForUser(any())).thenReturn(1L);

        User result = service.register(req);

        assertThat(result.getUsername()).isEqualTo("newuser");
        assertThat(result.getPasswordHash()).isEqualTo("hashed");
        verify(users, atLeastOnce()).save(any(User.class));
        verify(catService).createDefaultCatForUser(any());
    }

    @Test
    void register_duplicateUsername_shouldThrowConflict() {
        var req = new UserRegisterRequest("testuser", "pass", null);

        when(users.existsByUsername("testuser")).thenReturn(true);

        var ex = assertThrows(ResponseStatusException.class, () -> service.register(req));
        assertThat(ex.getStatusCode().value()).isEqualTo(409);
    }

    // --- authenticate ---

    @Test
    void authenticate_validCredentials_shouldReturnUser() {
        var req = new UserLoginRequest("testuser", "pass");

        when(users.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);

        User result = service.authenticate(req);

        assertThat(result.getUsername()).isEqualTo("testuser");
    }

    @Test
    void authenticate_userNotFound_shouldThrowUnauthorized() {
        var req = new UserLoginRequest("ghost", "pass");

        when(users.findByUsername("ghost")).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class, () -> service.authenticate(req));
        assertThat(ex.getStatusCode().value()).isEqualTo(401);
    }

    @Test
    void authenticate_oauthAccount_shouldThrowUnauthorizedWithHint() {
        existingUser.setPasswordHash(null);
        var req = new UserLoginRequest("testuser", "pass");

        when(users.findByUsername("testuser")).thenReturn(Optional.of(existingUser));

        var ex = assertThrows(ResponseStatusException.class, () -> service.authenticate(req));
        assertThat(ex.getStatusCode().value()).isEqualTo(401);
        assertThat(ex.getReason()).contains("Google");
    }

    @Test
    void authenticate_wrongPassword_shouldThrowUnauthorized() {
        var req = new UserLoginRequest("testuser", "wrong");

        when(users.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        var ex = assertThrows(ResponseStatusException.class, () -> service.authenticate(req));
        assertThat(ex.getStatusCode().value()).isEqualTo(401);
    }

    // --- processOAuthLogin ---

    @Test
    void processOAuthLogin_existingUser_shouldReturnWithoutCreating() {
        when(users.findByEmail("a@b.com")).thenReturn(Optional.of(existingUser));

        User result = service.processOAuthLogin("a@b.com", "Test User");

        assertThat(result).isSameAs(existingUser);
        verify(catService, never()).createDefaultCatForUser(any());
    }

    @Test
    void processOAuthLogin_newUser_shouldCreateUserAndDefaultCat() {
        when(users.findByEmail("new@b.com")).thenReturn(Optional.empty());
        when(users.existsByUsername(anyString())).thenReturn(false);
        when(users.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(catService.createDefaultCatForUser(any())).thenReturn(1L);

        User result = service.processOAuthLogin("new@b.com", "New User");

        assertThat(result.getEmail()).isEqualTo("new@b.com");
        assertThat(result.getAuthProvider()).isEqualTo(AuthProvider.GOOGLE);
        verify(catService).createDefaultCatForUser(any());
    }

    @Test
    void processOAuthLogin_blankEmail_shouldThrowBadRequest() {
        var ex = assertThrows(ResponseStatusException.class,
                () -> service.processOAuthLogin("  ", "Name"));
        assertThat(ex.getStatusCode().value()).isEqualTo(400);
    }

    // --- recordVisit (tested via authenticate) ---

    @Test
    void authenticate_firstVisit_shouldDecrementCatHealth() {
        existingUser.setSelectedCatId(5L);
        existingUser.setLastVisit(null);
        var req = new UserLoginRequest("testuser", "pass");

        when(users.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);

        service.authenticate(req);

        verify(catService).decrementStat(eq(5L), eq(StatType.HEALTH), any());
    }

    @Test
    void authenticate_recentVisit_shouldNotDecrementHealth() {
        existingUser.setSelectedCatId(5L);
        existingUser.setLastVisit(Instant.now().minusSeconds(30));
        var req = new UserLoginRequest("testuser", "pass");

        when(users.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);

        service.authenticate(req);

        verify(catService, never()).decrementStat(any(), any(), any());
    }
}
