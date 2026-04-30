package com.jotomo.pomo.session.controller;

import com.jotomo.pomo.session.dto.SessionRequest;
import com.jotomo.pomo.session.dto.SessionResponse;
import com.jotomo.pomo.session.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SessionResponse> getSession(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @PathVariable("id") UUID sessionId
    ){
        return ResponseEntity.ok(sessionService.getSession(userId, sessionId));
    }

    @GetMapping
    public ResponseEntity<List<SessionResponse>> getSessions(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to
    ) {
        return ResponseEntity.ok(sessionService.getSessionsFiltered(userId, from, to));
    }

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<SessionResponse> startSession(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @Valid @RequestBody SessionRequest request
    ){
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.startSession(userId, request));
    }

    @PostMapping(PATH_ID + "/finish")
    public ResponseEntity<SessionResponse> finishSession(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @PathVariable("id") UUID sessionId,
            @Valid @RequestBody SessionRequest request
    ){
        return ResponseEntity.ok(sessionService.finishSession(userId, sessionId, request));
    }
}
