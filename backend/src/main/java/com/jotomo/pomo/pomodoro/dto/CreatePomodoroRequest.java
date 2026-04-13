package com.jotomo.pomo.pomodoro.dto;

import com.jotomo.pomo.pomodoro.SessionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreatePomodoroRequest (
        @NotNull
        @Min(0)
        Integer orderIndex,

        @NotNull
        SessionType sessionType,

        Boolean completed
) {}
