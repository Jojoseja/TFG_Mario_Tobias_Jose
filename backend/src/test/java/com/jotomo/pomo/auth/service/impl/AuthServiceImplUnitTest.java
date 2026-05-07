package com.jotomo.pomo.auth.service.impl;

import com.jotomo.pomo.auth.dto.LoginRequest;
import com.jotomo.pomo.auth.service.AuthService;
import com.jotomo.pomo.exception.IncorrectPassword;
import com.jotomo.pomo.exception.UserNotFoundException;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class AuthServiceImplUnitTest {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;
    private UserEntity user;
    private final LoginRequest loginRequest = new LoginRequest(USER_EMAIL, USER_PASSWORD);
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        user = createUser();
        userRepository.save(user);
    }

    @Test
    void login_ReturnsUserResponse_WhenValid() {
        userResponse = authService.login(loginRequest);

        assertEquals(user.getId(), userResponse.id());
        assertEquals(user.getUsername(), userResponse.username());
        assertEquals(user.getEmail(), userResponse.email());
        assertEquals(user.getRole(), userResponse.role());
        assertEquals(user.isEnabled(), userResponse.enabled());
    }

    @Test
    void login_ThrowsUserNotFound_WhenEmailDoesntMatch() {
        LoginRequest wrongEmailRequest = new LoginRequest(NON_MATCHING_EMAIL, USER_PASSWORD);
        assertThrows(UserNotFoundException.class, () -> authService.login(wrongEmailRequest));
    }

    @Test
    void login_ThrowsIncorrectPassword_WhenPasswordDoesntMatch() {
        LoginRequest wrongEmailRequest = new LoginRequest(USER_EMAIL, NON_MATCHING_PASSWORD);
        assertThrows(IncorrectPassword.class, () -> authService.login(wrongEmailRequest));
    }

}