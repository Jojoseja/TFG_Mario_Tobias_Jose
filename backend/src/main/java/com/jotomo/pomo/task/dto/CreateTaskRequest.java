package com.jotomo.pomo.task.dto;

import com.jotomo.pomo.task.Priority;
import com.jotomo.pomo.task.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateTaskRequest (
        @NotBlank
        @Size(max = 100)
        String title,

        @Size(max = 1000)
        String description,

        @NotNull
        Priority priority,

        @NotNull
        Status status,

        UUID projectId,
        UUID parentTaskId
){}
