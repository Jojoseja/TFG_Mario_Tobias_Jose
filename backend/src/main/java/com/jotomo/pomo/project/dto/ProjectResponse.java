package com.jotomo.pomo.project.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProjectResponse (

        UUID id,

        String name,

        String description,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        UUID ownerId
){}
