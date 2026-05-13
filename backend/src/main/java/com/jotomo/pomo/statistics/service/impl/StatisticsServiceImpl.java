package com.jotomo.pomo.statistics.service.impl;

import com.jotomo.pomo.exception.UserNotFoundException;
import com.jotomo.pomo.pomodoro.repository.PomodoroRepository;
import com.jotomo.pomo.session.model.Session;
import com.jotomo.pomo.session.repository.SessionRepository;
import com.jotomo.pomo.statistics.dto.StatisticsResponse;
import com.jotomo.pomo.statistics.service.StatisticsService;
import com.jotomo.pomo.task.repository.TaskRepository;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class StatisticsServiceImpl implements StatisticsService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final PomodoroRepository pomodoroRepository;
    private final TaskRepository taskRepository;

    @Override
    public StatisticsResponse getStatistics(UUID userId) {
        UserEntity user = getUser(userId);

        Long totalCompletedSessions = sessionRepository.countByUser_IdAndEndedAtIsNotNull(userId);
        Long totalTime = sessionRepository.findSessionsByUser(user)
                .stream()
                .map(Session::getWorkMinutesUsed)
                .filter(Objects::nonNull)
                .mapToLong(time ->
                        time.getHour() * 3600L +
                                time.getMinute() * 60L +
                                time.getSecond()
                )
                .sum();

        UUID mostWorkedOnProjectId = sessionRepository.findMostWorkedProjectIdByUserId(userId)
                .orElseThrow(() -> {
                    log.warn("No such user with id: {}", userId);
                    return new UserNotFoundException();
                });

        LocalDateTime today = LocalDateTime.now();

        long workedSecondsToday = sessionRepository.sumWorkSecondsTodayByUserId(
                userId,
                LocalDateTime.of(today.getYear(), today.getMonth(), today.getDayOfMonth(),
                        LocalDateTime.MIN.getHour(), LocalDateTime.MIN.getMinute(), LocalDateTime.MIN.getSecond()
                ),
                LocalDateTime.of(today.getYear(), today.getMonth(), today.getDayOfMonth(),
                        LocalDateTime.MAX.getHour(), LocalDateTime.MAX.getMinute(), LocalDateTime.MAX.getSecond()
                )
        );

        long amountOfPomodorosCompleted = pomodoroRepository.countBySession_User_IdAndCompletedTrue(userId);

        long amountOfTasksCompleted = taskRepository.countByOwner_IdAndCompletedAtIsNotNull(userId);

        return new StatisticsResponse(
                totalCompletedSessions,
                totalTime,
                mostWorkedOnProjectId,
                workedSecondsToday,
                amountOfPomodorosCompleted,
                amountOfTasksCompleted
        );
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User with id {} not found", userId);
                    return new UserNotFoundException();
                });
    }
}
