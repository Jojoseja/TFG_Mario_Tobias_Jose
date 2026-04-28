package com.jotomo.pomo.user.repository;

import com.jotomo.pomo.testdata.TestSetUp;
import com.jotomo.pomo.user.model.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.NoSuchElementException;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryUnitTest {

    @Autowired
    private UserRepository userRepository;

    private UserEntity userEntity;

    @BeforeEach
    void setUp() {
        userEntity = TestSetUp.createUser();
        userRepository.save(userEntity);
    }

    @Test
    void existsByEmail_returnTrue_whenEmailExists() {
        assertTrue(userRepository.existsByEmail(USER_EMAIL));
    }

    @Test
    void existsByEmail_returnFalse_whenEmailDoesNotExist() {
        assertFalse(userRepository.existsByEmail(NON_MATCHING_EMAIL));
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
