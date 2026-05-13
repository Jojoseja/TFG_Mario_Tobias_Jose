package com.jotomo.pomo.session.dto;

import com.jotomo.pomo.pomodoro.dto.PomodoroResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SessionResponse (
        UUID id,
        LocalDateTime startedAt,
        LocalDateTime endedAt,
        Integer workMinutesUsed,
        Integer shortBreakDurationUsed,
        Integer longBreakDurationUsed,
        List<UUID> taskIds,
        List<PomodoroResponse> pomodoros,
        UUID sessionConfigurationId
){}
