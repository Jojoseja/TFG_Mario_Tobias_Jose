package com.jotomo.pomo.pomodoro.dto;

import com.jotomo.pomo.pomodoro.enums.SessionType;

import java.util.UUID;

public record PomodoroResponse(

        UUID id,
        int orderIndex,
        SessionType sessionType,
        boolean completed,
        UUID sessionId
) {
}
