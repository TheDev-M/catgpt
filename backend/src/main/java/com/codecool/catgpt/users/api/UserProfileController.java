package com.codecool.catgpt.users.api;

import com.codecool.catgpt.security.CurrentUser;
import com.codecool.catgpt.users.api.dto.ChangePasswordRequest;
import com.codecool.catgpt.users.api.dto.SelectedCatUpdateRequest;
import com.codecool.catgpt.users.api.dto.UpdateNicknameRequest;
import com.codecool.catgpt.users.api.dto.UserResponse;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.app.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/me")
@RequiredArgsConstructor
public class UserProfileController {

    private final CurrentUser currentUser;
    private final UserService users;

    @GetMapping
    public UserResponse getCurrentUser() {
        User user = currentUser.get();
        return UserResponse.from(user);
    }

    @PatchMapping("/selected-cat")
    public UserResponse updateSelectedCat(@RequestBody SelectedCatUpdateRequest req) {
        User user = currentUser.get();
        users.updateSelectedCat(user, req.selectedCatId());
        return UserResponse.from(user);
    }

    @PatchMapping("/nickname")
    public UserResponse updateNickname(@RequestBody UpdateNicknameRequest req) {
        User user = currentUser.get();
        users.updateNickname(user, req.nickname());
        return UserResponse.from(user);
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        User user = currentUser.get();
        users.changePassword(user, req.currentPassword(), req.newPassword());
        return ResponseEntity.noContent().build();
    }
}
