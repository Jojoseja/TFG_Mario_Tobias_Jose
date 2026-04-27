package com.jotomo.pomo.user.repository;

import com.jotomo.pomo.user.enums.UserRole;
import com.jotomo.pomo.user.model.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryUnitTest {

    @Autowired
    private UserRepository userRepository;

    private UserEntity userEntity;

    private static final String USER_USERNAME = "sampleusername";

    private static final String USER_PASSWORD = "userpassword123";

    private static final String USER_EMAIL = "sample@test.com";

    private static final boolean USER_ENABLED = true;

    private static final UserRole USER_ROLE = UserRole.USER;

    private static final String NON_MATCHING_EMAIL = "nonmatching@email.com";

    @BeforeEach
    void setUp() {
        userEntity = UserEntity
                .builder()
                .username(USER_USERNAME)
                .password(USER_PASSWORD)
                .email(USER_EMAIL)
                .enabled(USER_ENABLED)
                .role(USER_ROLE)
                .build();
        userRepository.save(userEntity);
    }

    @Test
    void existsByEmail_returnTrue_whenEmailExists() {
        assertTrue(userRepository.existsByEmail(USER_EMAIL));
    }

    @Test
    void findByEmail_returnEntity_whenEmailMatches() {
        assertEquals(userEntity, userRepository.findByEmail(USER_EMAIL).orElseThrow());
    }

    @Test
    void findByEmail_throwsNoSuchElement_whenEmailDoesNotMatch() {
        assertThrows(
                NoSuchElementException.class,
                () -> userRepository.findByEmail(NON_MATCHING_EMAIL).orElseThrow()
        );
    }
}
