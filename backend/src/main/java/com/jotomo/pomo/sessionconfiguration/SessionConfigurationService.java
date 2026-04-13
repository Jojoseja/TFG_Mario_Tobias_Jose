package com.jotomo.pomo.sessionconfiguration;


import com.jotomo.pomo.session.SessionRepository;
import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationRequest;
import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationResponse;
import com.jotomo.pomo.user.UserEntity;
import com.jotomo.pomo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionConfigurationService {
    private final SessionConfigurationRepository sessionConfigurationRepository;
    private final UserRepository userRepository;
    private final SessionConfigurationMapper sessionConfigurationMapper;

    @Transactional(readOnly = true)
    public SessionConfigurationResponse getSessionConfiguration(UUID userId) {
        UserEntity user = getUser(userId);

        SessionConfiguration config = sessionConfigurationRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session configuration not found"));

        return sessionConfigurationMapper.toResponse(config);
    }

    public SessionConfigurationResponse putSessionConfiguration(UUID userId, SessionConfigurationRequest request) {
        UserEntity user = getUser(userId);

        SessionConfiguration config = sessionConfigurationRepository.findByUser(user).orElse(null);

        if (config == null) {
            config = sessionConfigurationMapper.toEntity(request, user);
        } else {
            sessionConfigurationMapper.updateEntity(request, config);
        }

        SessionConfiguration saved = sessionConfigurationRepository.save(config);

        return sessionConfigurationMapper.toResponse(saved);
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
