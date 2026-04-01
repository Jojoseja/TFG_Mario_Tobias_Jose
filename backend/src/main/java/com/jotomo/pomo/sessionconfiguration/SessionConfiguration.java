package com.jotomo.pomo.sessionconfiguration;

import com.jotomo.pomo.session.Session;
import com.jotomo.pomo.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "session_configurations")
public class SessionConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private int workDuration;

    @Column(nullable = false)
    private int shortBreakDuration;

    @Column(nullable = false)
    private int longBreakDuration;

    @Column(nullable = false)
    private int cyclesBeforeLongBreak;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Builder.Default
    @OneToMany(mappedBy = "sessionConfiguration")
    private List<Session> sessions = new ArrayList<>();
}