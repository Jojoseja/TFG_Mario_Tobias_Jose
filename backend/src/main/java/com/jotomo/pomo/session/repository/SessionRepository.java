package com.jotomo.pomo.session.repository;

import com.jotomo.pomo.session.model.Session;
import com.jotomo.pomo.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {

    Optional<Session> findByIdAndUser(UUID id, UserEntity user);

    List<Session> findSessionsByUser(UserEntity user);

    List<Session> findSessionsByUserAndStartedAt(UserEntity user, LocalDateTime startedAt);
}
