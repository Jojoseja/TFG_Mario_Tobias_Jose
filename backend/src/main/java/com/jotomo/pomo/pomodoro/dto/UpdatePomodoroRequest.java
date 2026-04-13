package com.jotomo.pomo.pomodoro.dto;

import com.jotomo.pomo.pomodoro.SessionType;
import jakarta.validation.constraints.Min;

public record UpdatePomodoroRequest(
        @Min(0)
        Integer orderIndex,
        SessionType sessionType,
        Boolean completed
) {}
