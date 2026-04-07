package com.jotomo.pomo.session;

import com.jotomo.pomo.pomodoro.Pomodoro;
import com.jotomo.pomo.sessionconfiguration.SessionConfiguration;
import com.jotomo.pomo.task.Task;
import com.jotomo.pomo.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private LocalTime workMinutesUsed;
    private LocalTime shortBreakDurationUsed;
    private LocalTime longBreakDurationUsed;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "session_tasks",
            joinColumns = @JoinColumn(name = "session_id"),
            inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    private List<Task> tasks = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pomodoro> pomodoros = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_configuration_id")
    private SessionConfiguration sessionConfiguration;
}