package com.jotomo.pomo.project.dto;

import jakarta.validation.constraints.Size;

public record UpdateProjectRequest(

        @Size(max = 100)
        String name,

        @Size(max = 1000)
        String description
) {
}
