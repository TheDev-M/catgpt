package com.codecool.catgpt.security;

import com.codecool.catgpt.users.domain.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CurrentUserTest {

    private final CurrentUser currentUser = new CurrentUser();

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void get_withAppUserDetailsPrincipal_shouldReturnUser() {
        User user = User.builder().username("alice").build();
        var principal = new AppUserDetails(user);
        var auth = new UsernamePasswordAuthenticationToken(principal, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        User result = currentUser.get();

        assertThat(result).isSameAs(user);
    }

    @Test
    void get_noAuthentication_shouldReturnNull() {
        SecurityContextHolder.clearContext();

        assertThat(currentUser.get()).isNull();
    }

    @Test
    void get_nonAppUserDetailsPrincipal_shouldReturnNull() {
        var auth = new UsernamePasswordAuthenticationToken("anonymous", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        assertThat(currentUser.get()).isNull();
    }
}
