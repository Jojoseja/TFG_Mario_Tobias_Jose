package com.jotomo.pomo.sessionconfiguration.service;

import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationRequest;
import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationResponse;

import java.util.UUID;

public interface SessionConfigurationService {

    SessionConfigurationResponse getSessionConfiguration(UUID userId);

    SessionConfigurationResponse putSessionConfiguration(UUID userId, SessionConfigurationRequest request);
}
