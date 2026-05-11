package com.jotomo.pomo.pomodoro.service.impl;

import com.jotomo.pomo.pomodoro.dto.CreatePomodoroRequest;
import com.jotomo.pomo.pomodoro.dto.PomodoroResponse;
import com.jotomo.pomo.pomodoro.dto.UpdatePomodoroRequest;
import com.jotomo.pomo.pomodoro.mapper.PomodoroMapper;
import com.jotomo.pomo.pomodoro.model.Pomodoro;
import com.jotomo.pomo.pomodoro.repository.PomodoroRepository;
import com.jotomo.pomo.pomodoro.service.PomodoroService;
import com.jotomo.pomo.session.model.Session;
import com.jotomo.pomo.session.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PomodoroServiceImpl implements PomodoroService {

    private final PomodoroRepository pomodoroRepository;
    private final PomodoroMapper pomodoroMapper;
    private final SessionRepository sessionRepository;

    @Override
    public Optional<PomodoroResponse> getById(UUID pomodoroId) {
        Pomodoro pomodoro = pomodoroRepository.getById(pomodoroId);
        return Optional.ofNullable(pomodoroMapper.toResponse(pomodoro));
    }

    @Override
    public Optional<PomodoroResponse> getBySessionIdAndOrderIndex(UUID sessionId, int orderIndex) {
        Optional<Pomodoro> pomodoro = pomodoroRepository.findBySessionAndOrderIndex(sessionRepository.findById(sessionId)
                .orElseThrow(NoSuchElementException::new),
                orderIndex);
        return Optional.ofNullable(pomodoroMapper.toResponse(pomodoro.orElse(null)));
    }

    @Override
    public PomodoroResponse createPomodoro(CreatePomodoroRequest createPomodoroRequest) {
        Session session = sessionRepository.findById(createPomodoroRequest.sessionId()).orElseThrow(NoSuchElementException::new);
        Pomodoro pomodoro = pomodoroRepository.saveAndFlush(pomodoroMapper.toEntity(createPomodoroRequest, session));
        return pomodoroMapper.toResponse(pomodoro);
    }

    @Override
    public PomodoroResponse updatePomodoro(UUID pomodoroId, UpdatePomodoroRequest updatePomodoroRequest) {
        Pomodoro pomodoro = pomodoroRepository.findById(pomodoroId).orElseThrow(NoSuchElementException::new);
        pomodoroMapper.updateEntity(updatePomodoroRequest, pomodoro);
        return pomodoroMapper.toResponse(pomodoroRepository.saveAndFlush(pomodoro));
    }

    @Override
    public void deletePomodoro(UUID pomodoroId) {
        pomodoroRepository.delete(pomodoroRepository.findById(pomodoroId).orElseThrow(NoSuchElementException::new));
    }
}
