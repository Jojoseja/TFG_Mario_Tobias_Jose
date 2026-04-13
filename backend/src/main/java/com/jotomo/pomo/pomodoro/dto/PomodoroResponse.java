package com.jotomo.pomo.pomodoro.dto;

import com.jotomo.pomo.pomodoro.SessionType;

import java.util.UUID;

public record PomodoroResponse(
        UUID id,
        Integer orderIndex,
        SessionType sessionType,
        Boolean completed,
        UUID sessionId
) {}
