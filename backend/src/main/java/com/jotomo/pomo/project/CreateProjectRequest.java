package com.jotomo.pomo.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest (
        @NotBlank
        @Size(max = 100)
        String name,

        @NotNull
        @Size(max = 1000)
        String descripcion
){
}
