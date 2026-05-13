package com.jotomo.pomo.user.dto;

import com.jotomo.pomo.user.enums.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(

        UUID id,

        String username,

        String email,

        boolean enabled,

        UserRole role,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
){ }
