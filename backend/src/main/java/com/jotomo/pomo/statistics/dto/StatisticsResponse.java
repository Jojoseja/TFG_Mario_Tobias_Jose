package com.jotomo.pomo.statistics.dto;

import java.util.UUID;

public record StatisticsResponse(
        Long completedSessions,
        Long totalFocusedTime,
        UUID mostWorkedProject,
        long timeToday,
        long pomodorosCompleted,
        long taskCompleted
) {
}
