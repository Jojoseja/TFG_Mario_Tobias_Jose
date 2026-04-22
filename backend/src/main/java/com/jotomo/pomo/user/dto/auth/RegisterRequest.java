package com.jotomo.pomo.user.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Size(min = 1, max = 50)
        String username,
        @NotBlank
        @Email
        @Size(max = 100)
        String email,
        @NotBlank
        @Size(min = 8, max = 255)
        String password
) {}
