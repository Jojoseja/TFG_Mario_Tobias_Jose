package com.jotomo.pomo.pomodoro.dto;

import com.jotomo.pomo.pomodoro.enums.SessionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreatePomodoroRequest(

        @NotNull
        int orderIndex,

        @NotNull
        boolean completed,

        @NotNull
        @Size(max = 20)
        SessionType sessionType,

        @NotNull
        UUID sessionId
) {
}
