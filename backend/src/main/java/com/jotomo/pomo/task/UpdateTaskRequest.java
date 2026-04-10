package com.jotomo.pomo.task;

import jakarta.validation.constraints.Size;

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
        Boolean archived
){}
