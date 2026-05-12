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
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SessionConfigurationRepository sessionConfigurationRepository;
    private final SessionMapper sessionMapper;

    @Transactional(readOnly = true)
    public SessionResponse getSession(UUID userId, UUID sessionId) {
        log.debug("Finding session: userId={}, sessionId={}", userId, sessionId);

        UserEntity user = getUser(userId);
        Session session = getSession(user, sessionId);

        log.debug("Session found: userId={}, sessionId={}", userId, sessionId);

        return sessionMapper.toResponse(session);
    }

    @Transactional(readOnly = true)
    public List<SessionResponse> getSessionsFiltered(UUID userId, LocalDateTime from, LocalDateTime to) {
        log.debug("Finding sessions filtered: userId={}, from={}, to={}", userId, from, to);

        if (from != null && to != null && from.isAfter(to)) {
            log.warn("Session filtering rejected: 'from' is after 'to', userId={}, from={}, to={}",
                    userId,
                    from,
                    to
            );

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'from' cannot be after 'to'");
        }

        UserEntity user = getUser(userId);

        List<SessionResponse> sessions = sessionRepository.findSessionsByUser(user).stream()
                .filter(s -> from == null || !s.getStartedAt().isBefore(from))
                .filter(s -> to == null || !s.getStartedAt().isAfter(to))
                .sorted(Comparator.comparing(Session::getStartedAt).reversed())
                .map(sessionMapper::toResponse)
                .toList();

        log.debug("Sessions filtered: userId={}, from={}, to={}, count={}",
                userId,
                from,
                to,
                sessions.size()
        );

        return sessions;
    }

    public SessionResponse startSession(UUID userId, SessionRequest request) {
        log.info("Starting session: userId={}, sessionConfigurationId={}",
                userId,
                request.sessionConfigurationId()
        );

        UserEntity user = getUser(userId);

        if (hasActiveSession(user)) {
            log.warn("Session start rejected: user already has an active session, userId={}", userId);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already has an active session");
        }

        SessionConfiguration config = sessionConfigurationRepository.findByIdAndUser(
                        request.sessionConfigurationId(),
                        user
                )
                .orElseThrow(() -> {
                    log.warn("Session start rejected: session configuration not found, userId={}, sessionConfigurationId={}",
                            userId,
                            request.sessionConfigurationId()
                    );

                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Session configuration not found");
                });

        Session session = sessionMapper.toEntity(request, user, config, List.of());
        Session saved = sessionRepository.save(session);

        log.info("Session started: userId={}, sessionId={}, sessionConfigurationId={}, startedAt={}",
                userId,
                saved.getId(),
                config.getId(),
                saved.getStartedAt()
        );

        return sessionMapper.toResponse(saved);
    }

    public SessionResponse finishSession(UUID userId, UUID sessionId, SessionRequest request) {
        log.info("Finishing session: userId={}, sessionId={}", userId, sessionId);

        UserEntity user = getUser(userId);

        Session session = getSession(user, sessionId);

        if (session.getEndedAt() != null) {
            log.warn("Session finish rejected: session already finished, userId={}, sessionId={}, endedAt={}",
                    userId,
                    sessionId,
                    session.getEndedAt()
            );

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Session already finished");
        }

        session.setEndedAt(request.endedAt());
        session.setWorkMinutesUsed(toLocalTime(request.workMinutesUsed()));
        session.setShortBreakDurationUsed(toLocalTime(request.shortBreakDurationUsed()));
        session.setLongBreakDurationUsed(toLocalTime(request.longBreakDurationUsed()));

        Session saved = sessionRepository.save(session);

        log.info("Session finished: userId={}, sessionId={}, startedAt={}, endedAt={}, workMinutesUsed={}",
                userId,
                saved.getId(),
                saved.getStartedAt(),
                saved.getEndedAt(),
                saved.getWorkMinutesUsed()
        );

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
