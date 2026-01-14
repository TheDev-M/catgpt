package com.codecool.catgpt.users.api;

import com.codecool.catgpt.security.JwtService;
import com.codecool.catgpt.users.api.dto.*;
import com.codecool.catgpt.users.app.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService users;
    private final JwtService jwtService;


    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRegisterRequest req) {
        var created = users.register(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.from(created));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest req) {
        var user = users.authenticate(req);

        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", UserResponse.from(user)
                )
        );
    }

}
