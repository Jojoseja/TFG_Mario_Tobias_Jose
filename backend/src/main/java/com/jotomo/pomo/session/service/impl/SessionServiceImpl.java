package com.jotomo.pomo.session.service.impl;

import com.jotomo.pomo.session.dto.SessionRequest;
import com.jotomo.pomo.session.dto.SessionResponse;
import com.jotomo.pomo.session.mapper.SessionMapper;
import com.jotomo.pomo.session.model.Session;
import com.jotomo.pomo.session.repository.SessionRepository;
import com.jotomo.pomo.session.service.SessionService;
import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import com.jotomo.pomo.sessionconfiguration.repository.SessionConfigurationRepository;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;

    private final UserRepository userRepository;

    private final SessionConfigurationRepository sessionConfigurationRepository;

    private final SessionMapper sessionMapper;

    @Transactional(readOnly = true)
    public SessionResponse getSession(UUID userId, UUID sessionId) {
        UserEntity user = getUser(userId);
        Session session = getSession(user, sessionId);

        return sessionMapper.toResponse(session);
    }

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

    public SessionResponse startSession(UUID userId, SessionRequest request) {
        UserEntity user = getUser(userId);

        if (hasActiveSession(user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already has an active session");
        }

        SessionConfiguration config = sessionConfigurationRepository.findByIdAndUser(request.sessionConfigurationId(), user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session configuration not found"));

        Session session = sessionMapper.toEntity(request, user, config, List.of());
        Session saved = sessionRepository.save(session);

        return sessionMapper.toResponse(saved);
    }

    public SessionResponse finishSession(UUID userId, UUID sessionId, SessionRequest request) {
        UserEntity user = getUser(userId);

        Session session = getSession(user, sessionId);
        if (session.getEndedAt() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Session already finished");
        }

        session.setEndedAt(request.endedAt());
        session.setWorkMinutesUsed(toLocalTime(request.workMinutesUsed()));
        session.setShortBreakDurationUsed(toLocalTime(request.shortBreakDurationUsed()));
        session.setLongBreakDurationUsed(toLocalTime(request.longBreakDurationUsed()));


        Session saved = sessionRepository.save(session);

        return sessionMapper.toResponse(saved);
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Session getSession(UserEntity user, UUID sessionId) {
        return sessionRepository.findByIdAndUser(sessionId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    }

    private boolean hasActiveSession(UserEntity user) {
        return sessionRepository.findSessionsByUser(user).stream()
                .anyMatch(s -> s.getEndedAt() == null);
    }

    private LocalTime toLocalTime(Integer minutes) {
        if (minutes == null) return null;
        return LocalTime.ofSecondOfDay(minutes * 60L);
    }

}
