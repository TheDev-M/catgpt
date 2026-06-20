package com.codecool.catgpt.security;

import com.codecool.catgpt.users.domain.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public User get() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AppUserDetails userDetails)) {
            return null;
        }
        return userDetails.user();
    }
}
