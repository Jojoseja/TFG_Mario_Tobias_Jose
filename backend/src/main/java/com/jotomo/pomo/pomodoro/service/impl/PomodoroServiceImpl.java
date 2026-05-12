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
        log.info("getById Pomodoro: {}", pomodoroId);
        Optional<Pomodoro> pomodoro = pomodoroRepository.findById(pomodoroId);
        return pomodoro.map(pomodoroMapper::toResponse);
    }

    @Override
    public Optional<PomodoroResponse> getBySessionIdAndOrderIndex(UUID sessionId, int orderIndex) {
        log.debug("Finding pomodoro by session and order index: sessionId={}, orderIndex={}",
                sessionId,
                orderIndex
        );

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    log.warn("Pomodoro lookup rejected: session not found, sessionId={}", sessionId);
                    return new NoSuchElementException("Session not found");
                });

        Optional<Pomodoro> pomodoro = pomodoroRepository.findBySessionAndOrderIndex(session, orderIndex);

        if (pomodoro.isEmpty()) {
            log.debug("Pomodoro not found: sessionId={}, orderIndex={}", sessionId, orderIndex);
        } else {
            log.debug("Pomodoro found: pomodoroId={}, sessionId={}, orderIndex={}",
                    pomodoro.get().getId(),
                    sessionId,
                    orderIndex
            );
        }

        return pomodoro.map(pomodoroMapper::toResponse);
    }

    @Override
    public PomodoroResponse createPomodoro(CreatePomodoroRequest request) {
        log.info("Creating pomodoro: sessionId={}", request.sessionId());

        Session session = sessionRepository.findById(request.sessionId())
                .orElseThrow(() -> {
                    log.warn("Pomodoro creation rejected: session not found, sessionId={}", request.sessionId());
                    return new NoSuchElementException("Session not found");
                });

        Pomodoro pomodoro = pomodoroRepository.saveAndFlush(
                pomodoroMapper.toEntity(request, session)
        );

        log.info("Pomodoro created: pomodoroId={}, sessionId={}",
                pomodoro.getId(),
                session.getId()
        );

        return pomodoroMapper.toResponse(pomodoro);
    }

    @Override
    public PomodoroResponse updatePomodoro(UUID pomodoroId, UpdatePomodoroRequest request) {
        log.info("Updating pomodoro: pomodoroId={}", pomodoroId);

        Pomodoro pomodoro = pomodoroRepository.findById(pomodoroId)
                .orElseThrow(() -> {
                    log.warn("Pomodoro update rejected: pomodoro not found, pomodoroId={}", pomodoroId);
                    return new NoSuchElementException("Pomodoro not found");
                });

        pomodoroMapper.updateEntity(request, pomodoro);

        Pomodoro updatedPomodoro = pomodoroRepository.saveAndFlush(pomodoro);

        log.info("Pomodoro updated: pomodoroId={}", updatedPomodoro.getId());

        return pomodoroMapper.toResponse(updatedPomodoro);
    }

    @Override
    public void deletePomodoro(UUID pomodoroId) {
        log.info("Deleting pomodoro: pomodoroId={}", pomodoroId);

        Pomodoro pomodoro = pomodoroRepository.findById(pomodoroId)
                .orElseThrow(() -> {
                    log.warn("Pomodoro deletion rejected: pomodoro not found, pomodoroId={}", pomodoroId);
                    return new NoSuchElementException("Pomodoro not found");
                });

        pomodoroRepository.delete(pomodoro);

        log.info("Pomodoro deleted: pomodoroId={}", pomodoroId);
    }

}
