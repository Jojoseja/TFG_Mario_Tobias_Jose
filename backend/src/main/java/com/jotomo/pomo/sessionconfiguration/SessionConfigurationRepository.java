package com.jotomo.pomo.sessionconfiguration;

import com.jotomo.pomo.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SessionConfigurationRepository extends JpaRepository<SessionConfiguration, UUID> {
    Optional<SessionConfiguration> findById(UUID id);

    Optional<SessionConfiguration> findByUser(UserEntity user);
}
