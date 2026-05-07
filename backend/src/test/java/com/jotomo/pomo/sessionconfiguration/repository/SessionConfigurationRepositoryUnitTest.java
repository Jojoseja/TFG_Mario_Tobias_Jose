package com.jotomo.pomo.sessionconfiguration.repository;

import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class SessionConfigurationRepositoryUnitTest {

    @Autowired
    private SessionConfigurationRepository sessionConfigurationRepository;

    @Autowired
    private UserRepository userRepository;

    private SessionConfiguration sessionConfiguration;

    private UserEntity userEntity;

    @BeforeEach
    void setUp() {
        userEntity = createUser();
        userRepository.save(userEntity);
    }

    @Test
    void findByUser_ReturnSessionConfiguration_WhenMatch() {
        createSessionConfiguration();
        assertEquals(sessionConfiguration, sessionConfigurationRepository.findByUser(userEntity).get());
    }

    @Test
    void findByIdAndUser_ReturnSessionConfiguration_WhenMatch() {
        createSessionConfiguration();
        assertEquals(sessionConfiguration, sessionConfigurationRepository.findByIdAndUser(sessionConfiguration.getId(), userEntity).get());
    }

    void createSessionConfiguration() {
        sessionConfiguration = SessionConfiguration.builder()
                .workDuration(SESSIONCONFIGURATION_WORKDURATION)
                .shortBreakDuration(SESSIONCONFIGURATION_SHORTBREAKDURATION)
                .longBreakDuration(SESSIONCONFIGURATION_LONGBREAKDURATION)
                .cyclesBeforeLongBreak(SESSIONCONFIGURATION_CYCLESBEFOREBREAK)
                .user(userEntity)
                .build();
        sessionConfigurationRepository.save(sessionConfiguration);
    }
}
