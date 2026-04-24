package com.jotomo.pomo.task.dto;

import com.jotomo.pomo.task.enums.Priority;
import com.jotomo.pomo.task.enums.Status;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskResponse (

        UUID id,

        String title,

        String description,

        Priority priority,

        Status status,

        boolean archived,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        LocalDateTime completedAt,

        LocalDateTime archivedAt,

        UUID projectId,

        UUID parentTaskId
){}
