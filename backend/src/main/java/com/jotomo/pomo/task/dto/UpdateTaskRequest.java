package com.jotomo.pomo.task.dto;

import com.jotomo.pomo.task.enums.Priority;
import com.jotomo.pomo.task.enums.Status;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateTaskRequest (

        @Size(min = 1, max = 100)
        String title,

        @Size(max = 1000)
        String description,

        Priority priority,

        Status status,

        UUID projectId,

        UUID parentTaskId,

        Boolean archived,

        LocalDateTime completedAt,

        LocalDateTime archivedAt
){}
