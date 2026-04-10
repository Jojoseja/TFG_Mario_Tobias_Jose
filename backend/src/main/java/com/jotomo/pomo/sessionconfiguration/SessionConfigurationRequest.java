package com.jotomo.pomo.sessionconfiguration;

public record SessionConfigurationRequest(
        Integer workDuration,
        Integer shortBreakDuration,
        Integer longBreakDuration,
        Integer cyclesBeforeLongBreak
) {
}
