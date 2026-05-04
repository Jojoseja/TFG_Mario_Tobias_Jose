package com.jotomo.pomo.sessionconfiguration.controller;

import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationRequest;
import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationResponse;
import com.jotomo.pomo.sessionconfiguration.service.SessionConfigurationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.jotomo.pomo.constants.ApiConstants.*;


@RestController
@RequestMapping(SESSION_CONFIGURATION_PATH)
@RequiredArgsConstructor
@Slf4j
public class SessionConfigurationController {

    private final SessionConfigurationService sessionConfigurationService;

    @GetMapping()
    public ResponseEntity<SessionConfigurationResponse> getSessionConfiguration(
            @RequestHeader(USER_ID_HEADER) UUID userId
    ){
        return ResponseEntity.ok(sessionConfigurationService.getSessionConfiguration(userId));
    }

    @PutMapping()
    public ResponseEntity<SessionConfigurationResponse> putSessionConfiguration(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @RequestBody SessionConfigurationRequest request
    ){
        return ResponseEntity.ok(sessionConfigurationService.putSessionConfiguration(userId, request));
    }
}
