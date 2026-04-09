package com.jotomo.pomo.session;

import com.jotomo.pomo.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {
    Optional<Session> findById(UUID id);

    List<Session> findSessionsByUser(UserEntity user);

    List<Session> findSessionsByUserAndStartedAt(UserEntity user, LocalDateTime startedAt);
}
