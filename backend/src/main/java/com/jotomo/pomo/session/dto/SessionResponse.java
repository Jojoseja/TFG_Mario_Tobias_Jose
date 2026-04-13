package com.jotomo.pomo.session.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SessionResponse (
        UUID id,
        LocalDateTime statrtedAt,
        LocalDateTime endedAt,
        Integer workMinutesUsed,
        Integer shortBreakDurationUsed,
        Integer longBreakDurationUsed,
        UUID sessionConfigurationId,
        List<UUID> taskIds

){
}
