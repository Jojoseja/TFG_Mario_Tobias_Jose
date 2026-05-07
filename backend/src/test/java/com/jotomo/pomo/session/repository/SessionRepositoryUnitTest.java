package com.jotomo.pomo.session.repository;

import com.jotomo.pomo.session.model.Session;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

import static com.jotomo.pomo.testdata.TestSetUp.SESSION_STARTED_AT;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class SessionRepositoryUnitTest {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    private Session session;

    private final List<Session> sessionList = new ArrayList<>();

    private UserEntity userEntity;

    @BeforeEach
    void setUp() {
        userEntity = createUser();
        userRepository.save(userEntity);
    }

    @Test
    void findByIdAndUser_ReturnSession_WhenMatching() {
        createSession();
        assertEquals(session, sessionRepository.findByIdAndUser(session.getId(), userEntity).get());
    }

    @Test
    void findSessionsByUser_ReturnList_WhenMatching() {
        createSession();
        sessionList.add(session);
        assertEquals(sessionList, sessionRepository.findSessionsByUser(userEntity));
    }

    @Test
    void findSessionsByUserAndStartedAt() {
        createSession();
        sessionList.add(session);
        assertEquals(sessionList, sessionRepository.findSessionsByUserAndStartedAt(userEntity, SESSION_STARTED_AT));
    }

    void createSession(){
        session = Session.builder()
                .startedAt(SESSION_STARTED_AT)
                .user(userEntity)
                .build();
        sessionRepository.save(session);
    }
}
