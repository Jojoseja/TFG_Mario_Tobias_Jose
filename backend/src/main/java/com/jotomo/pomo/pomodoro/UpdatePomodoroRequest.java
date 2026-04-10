package com.jotomo.pomo.pomodoro;

import jakarta.validation.constraints.Min;

public record UpdatePomodoroRequest(
        @Min(0)
        Integer orderIndex,
        SessionType sessionType,
        Boolean completed
) {}
