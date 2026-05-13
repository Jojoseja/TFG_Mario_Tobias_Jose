package com.jotomo.pomo.pomodoro.repository;

import com.jotomo.pomo.pomodoro.model.Pomodoro;
import com.jotomo.pomo.session.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PomodoroRepository extends JpaRepository<Pomodoro, UUID> {

    Optional<Pomodoro> findBySessionAndOrderIndex(Session session, int orderIndex);

    long countBySession_User_IdAndCompletedTrue(UUID userId);
}
