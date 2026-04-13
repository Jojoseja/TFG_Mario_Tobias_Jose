package com.jotomo.pomo.task.dto;

import com.jotomo.pomo.task.Priority;
import com.jotomo.pomo.task.Status;
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
