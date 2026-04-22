package com.jotomo.pomo.sessionconfiguration.dto;

public record SessionConfigurationRequest(
        Integer workDuration,
        Integer shortBreakDuration,
        Integer longBreakDuration,
        Integer cyclesBeforeLongBreak
) {
}
