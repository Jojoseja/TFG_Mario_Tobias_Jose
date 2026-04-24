package com.jotomo.pomo.session.service;

import com.jotomo.pomo.session.dto.SessionRequest;
import com.jotomo.pomo.session.dto.SessionResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SessionService {

    SessionResponse getSession(UUID userId, UUID sessionId);

    List<SessionResponse> getSessionsFiltered(UUID userId, LocalDateTime from, LocalDateTime to);

    SessionResponse startSession(UUID userId, SessionRequest request);

    SessionResponse finishSession(UUID userId, UUID sessionId, SessionRequest request);
}
