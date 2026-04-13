package com.jotomo.pomo.session;

import com.jotomo.pomo.project.Project;
import com.jotomo.pomo.session.dto.SessionRequest;
import com.jotomo.pomo.session.dto.SessionResponse;
import com.jotomo.pomo.sessionconfiguration.SessionConfigurationRepository;
import com.jotomo.pomo.task.Task;
import com.jotomo.pomo.task.TaskRepository;
import com.jotomo.pomo.user.UserEntity;
import com.jotomo.pomo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final SessionConfigurationRepository sessionConfigurationRepository;
    private final SessionMapper sessionMapper;

    @Transactional(readOnly = true)
    public List<SessionResponse> getSessionsFiltered(UUID userId, LocalDateTime from, LocalDateTime to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'from' cannot be after 'to'");
        }

        UserEntity user = getUser(userId);

        return sessionRepository.findSessionsByUser(user).stream()
                .filter(s -> from == null || !s.getStartedAt().isBefore(from))
                .filter(s -> to == null || !s.getStartedAt().isAfter(to))
                .sorted(Comparator.comparing(Session::getStartedAt).reversed())
                .map(sessionMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SessionResponse getSession(UUID userId, UUID sessionId) {
        UserEntity user = getUser(userId);
        Session session = getSession(user, sessionId);

        return sessionMapper.toResponse(session);
    }


    // TODO: resolver user + sessionConfiguration + tasks
    public SessionResponse startSession(UUID userId, SessionRequest request) {
        UserEntity user = getUser(userId);

        if (hasActiveSession(user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already has an active session");
        }

        // 2) resolver user + sessionConfiguration + tasks
        // 3) crear entidad Session (startedAt = now)
        // 4) guardar
        // 5) mapear a SessionResponse
        return null;
    }

    // TODO: Calculo de tiempo de session. Que pasa si el usuario cierra el programa?
    public SessionResponse finishSession(UUID userId, UUID sessionId /*, SessionFinishRequest request */) {
        // POST /api/v1/sessions/{id}/finish
        // 1) cargar sesión
        // 2) validar ownership y que esté activa
        // 3) set endedAt y métricas usadas
        // 4) guardar
        // 5) mapear a SessionResponse
        return null;
    }

    // helpers:
    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Session getSession(UserEntity user, UUID projectId) {
        return sessionRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private boolean hasActiveSession(UserEntity user) {
        return sessionRepository.findSessionsByUser(user).stream()
                .anyMatch(s -> s.getEndedAt() == null);
    }


    //TODO: implementar metodo para iniciar una session
    private List<Task> resolveTasks(UserEntity user, List<UUID> taskIds) {
        return null;
    }

    }