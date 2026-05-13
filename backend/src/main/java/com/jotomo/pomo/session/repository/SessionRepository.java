package com.jotomo.pomo.session.repository;

import com.jotomo.pomo.session.model.Session;
import com.jotomo.pomo.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {

    Optional<Session> findByIdAndUser(UUID id, UserEntity user);

    List<Session> findSessionsByUser(UserEntity user);

    List<Session> findSessionsByUserAndStartedAt(UserEntity user, LocalDateTime startedAt);

    Long countByUser_IdAndEndedAtIsNotNull(UUID user_id);

    @Query(value = """
            SELECT x.project_id
            FROM (
                SELECT DISTINCT
                    t.project_id AS project_id,
                    s.id AS session_id,
                    s.work_minutes_used AS work_time
                FROM sessions s
                JOIN session_tasks st ON st.session_id = s.id
                JOIN tasks t ON t.id = st.task_id
                WHERE s.user_id = :userId
                  AND s.ended_at IS NOT NULL
                  AND s.work_minutes_used IS NOT NULL
                  AND t.project_id IS NOT NULL
            ) x
            GROUP BY x.project_id
            ORDER BY SUM(
                EXTRACT(HOUR FROM x.work_time) * 3600 +
                EXTRACT(MINUTE FROM x.work_time) * 60 +
                EXTRACT(SECOND FROM x.work_time)
            ) DESC
            LIMIT 1
            """, nativeQuery = true)
    Optional<UUID> findMostWorkedProjectIdByUserId(@Param("userId") UUID userId);

    @Query(value = """
            SELECT COALESCE(CAST(SUM(EXTRACT(EPOCH FROM s.work_minutes_used)) AS BIGINT), 0)
            FROM sessions s
            WHERE s.user_id = :userId
              AND s.ended_at IS NOT NULL
              AND s.work_minutes_used IS NOT NULL
              AND s.started_at >= :startOfDay
              AND s.started_at < :endOfDay
            """, nativeQuery = true)
    long sumWorkSecondsTodayByUserId(
            @Param("userId") UUID userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}
