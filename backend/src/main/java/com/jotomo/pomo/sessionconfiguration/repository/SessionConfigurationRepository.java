package com.jotomo.pomo.sessionconfiguration.repository;

import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import com.jotomo.pomo.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SessionConfigurationRepository extends JpaRepository<SessionConfiguration, UUID> {

    Optional<SessionConfiguration> findByUser(UserEntity user);

    Optional<SessionConfiguration> findByIdAndUser(UUID id, UserEntity user);
}
