package com.jotomo.pomo.pomodoro.service;

import com.jotomo.pomo.pomodoro.dto.CreatePomodoroRequest;
import com.jotomo.pomo.pomodoro.dto.PomodoroRequest;
import com.jotomo.pomo.pomodoro.dto.PomodoroResponse;
import com.jotomo.pomo.pomodoro.dto.UpdatePomodoroRequest;

import java.util.Optional;
import java.util.UUID;

public interface PomodoroService {

    Optional<PomodoroResponse> getById(UUID pomodoroId);

    Optional<PomodoroResponse> getBySessionIdAndOrderIndex(UUID sessionId, int orderIndex);

    PomodoroResponse createPomodoro(CreatePomodoroRequest createPomodoroRequest);

    PomodoroResponse updatePomodoro(UUID pomodoroId, UpdatePomodoroRequest updatePomodoroRequest);

    void deletePomodoro(UUID pomodoroId);
}
