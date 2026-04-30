package com.jotomo.pomo.session.controller;

import com.jotomo.pomo.session.dto.SessionRequest;
import com.jotomo.pomo.session.dto.SessionResponse;
import com.jotomo.pomo.session.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.jotomo.pomo.constants.ApiConstants.*;

@RestController
@RequestMapping(SESSION_PATH)
@RequiredArgsConstructor
@Slf4j
public class SessionController {

    private final SessionService sessionService;

    @GetMapping(PATH_ID)
    public SessionResponse getSession(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @PathVariable UUID sessionId
    ){
        return sessionService.getSession(userId, sessionId);
    }

    @GetMapping
    public List<SessionResponse> getSessions(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to
    ) {
        return sessionService.getSessionsFiltered(userId, from, to);
    }

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    public SessionResponse startSession(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @RequestBody SessionRequest request
    ){
        return sessionService.startSession(userId, request);
    }

    @PostMapping("/finish")
    public SessionResponse finishSession(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @PathVariable UUID sessionId,
            @RequestBody SessionRequest request
    ){
        return sessionService.finishSession(userId, sessionId, request);
    }
}
