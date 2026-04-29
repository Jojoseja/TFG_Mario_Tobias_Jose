package com.jotomo.pomo.auth;

import com.jotomo.pomo.auth.dto.LoginRequest;
import com.jotomo.pomo.auth.service.AuthService;
import com.jotomo.pomo.constants.ApiConstants;
import com.jotomo.pomo.user.dto.UserResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiConstants.AUTH_PATH)
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @NotNull @RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }
}
