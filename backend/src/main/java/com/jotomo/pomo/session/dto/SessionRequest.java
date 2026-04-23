package com.jotomo.pomo.session.dto;

import com.jotomo.pomo.pomodoro.dto.PomodoroRequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SessionRequest (
        @NotNull UUID sessionConfigurationId,

        LocalDateTime startedAt,
        LocalDateTime endedAt,

        @PositiveOrZero
        Integer workMinutesUsed,

        @PositiveOrZero
        Integer shortBreakDurationUsed,

        @PositiveOrZero
        Integer longBreakDurationUsed,

        List<PomodoroRequest> pomodoros
){
}
