package com.jotomo.pomo.pomodoro;

import com.jotomo.pomo.session.Session;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pomodoros")
public class Pomodoro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private boolean completed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionType sessionType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
}