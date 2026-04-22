package com.jotomo.pomo.sessionconfiguration.dto;

import java.util.UUID;

public record SessionConfigurationResponse(
        UUID id,
        int workDuration,
        int shortBreakDuration,
        int longBreakDuration,
        int cyclesBeforeLongBreak
) {
}
