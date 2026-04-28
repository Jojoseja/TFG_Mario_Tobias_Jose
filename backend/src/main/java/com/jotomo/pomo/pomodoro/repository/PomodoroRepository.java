package com.jotomo.pomo.pomodoro.repository;

import com.jotomo.pomo.pomodoro.model.Pomodoro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PomodoroRepository extends JpaRepository<Pomodoro, UUID> {
}
