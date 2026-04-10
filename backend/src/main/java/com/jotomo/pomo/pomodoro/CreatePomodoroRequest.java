package com.jotomo.pomo.pomodoro;

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
