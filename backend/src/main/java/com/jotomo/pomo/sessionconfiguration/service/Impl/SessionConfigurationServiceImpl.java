package com.jotomo.pomo.sessionconfiguration.service.Impl;


import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationRequest;
import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationResponse;
import com.jotomo.pomo.sessionconfiguration.mapper.SessionConfigurationMapper;
import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import com.jotomo.pomo.sessionconfiguration.repository.SessionConfigurationRepository;
import com.jotomo.pomo.sessionconfiguration.service.SessionConfigurationService;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SessionConfigurationServiceImpl implements SessionConfigurationService {

    private final SessionConfigurationRepository sessionConfigurationRepository;
    private final UserRepository userRepository;
    private final SessionConfigurationMapper sessionConfigurationMapper;

    @Transactional(readOnly = true)
    public SessionConfigurationResponse getSessionConfiguration(UUID userId) {
        log.debug("Finding session configuration: userId={}", userId);

        UserEntity user = getUser(userId);

        SessionConfiguration config = sessionConfigurationRepository.findByUser(user)
                .orElseThrow(() -> {
                    log.warn("Session configuration lookup rejected: configuration not found, userId={}", userId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Session configuration not found");
                });

        log.debug("Session configuration found: userId={}, sessionConfigurationId={}",
                userId,
                config.getId()
        );

        return sessionConfigurationMapper.toResponse(config);
    }

    public SessionConfigurationResponse putSessionConfiguration(UUID userId, SessionConfigurationRequest request) {
        log.info("Saving session configuration: userId={}", userId);
        UserEntity user = getUser(userId);
        SessionConfiguration config = sessionConfigurationRepository.findByUser(user).orElse(null);
        boolean created = config == null;

        if (created) {
            config = sessionConfigurationMapper.toEntity(request, user);
        } else {
            sessionConfigurationMapper.updateEntity(request, config);
        }

        SessionConfiguration saved = sessionConfigurationRepository.save(config);

        if (created) {
            log.info("Session configuration created: userId={}, sessionConfigurationId={}",
                    userId,
                    saved.getId()
            );
        } else {
            log.info("Session configuration updated: userId={}, sessionConfigurationId={}",
                    userId,
                    saved.getId()
            );
        }

        return sessionConfigurationMapper.toResponse(saved);
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
