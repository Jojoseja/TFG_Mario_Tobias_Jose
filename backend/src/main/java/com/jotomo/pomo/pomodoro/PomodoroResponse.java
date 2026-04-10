package com.jotomo.pomo.pomodoro;

import java.util.UUID;

public record PomodoroResponse(
        UUID id,
        Integer orderIndex,
        SessionType sessionType,
        Boolean completed,
        UUID sessionId
) {}
