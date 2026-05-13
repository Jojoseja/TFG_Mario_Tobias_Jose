package com.jotomo.pomo.user.service.impl;

import com.jotomo.pomo.exception.UserNotFoundException;
import com.jotomo.pomo.user.dto.CreateUserRequest;
import com.jotomo.pomo.user.dto.UpdateUserMeRequest;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserServiceImplUnitTest {

    @Autowired
    private UserService userService;
    private UserEntity user;
    private CreateUserRequest createUserRequest;

    @BeforeEach
    void setUp() {
        user = createUser();
        createUserRequest = new CreateUserRequest(
                user.getUsername(),
                user.getEmail(),
                user.getPassword()
        );
    }

    @Test
    void save_PersistsEntity_WhenValid() {
        UserResponse userResponse = userService.save(createUserRequest);
        assertNotNull(userResponse.id());
    }

    @Test
    void findById_ReturnsEntity_WhenIdExists() {
        UserResponse userResponse = userService.save(createUserRequest);

        UserResponse response = userService.findById(userResponse.id()).orElseThrow();

        assertEquals(userResponse.id(), response.id());
        assertEquals(userResponse.username(), response.username());
        assertEquals(userResponse.email(), response.email());
        assertEquals(userResponse.role(), response.role());
    }

    @Test
    void findById_ReturnsEmpty_WhenIdDoesNotExist() {
        Optional<UserResponse> response = userService.findById(NON_MATCHING_ID);

        assertTrue(response.isEmpty());
    }

    @Test
    void findByEmail_ReturnsEntity_WhenEmailExist() {
        UserResponse userResponse = userService.save(createUserRequest);
        UserResponse response = userService.findByEmail(user.getEmail()).orElseThrow();

        assertEquals(userResponse.id(), response.id());
        assertEquals(userResponse.username(), response.username());
        assertEquals(userResponse.email(), response.email());
        assertEquals(userResponse.role(), response.role());
    }

    @Test
    void findByEmail_ReturnsEmpty_WhenEmailDoesNotExist() {
        Optional<UserResponse> response = userService.findByEmail(NON_MATCHING_EMAIL);

        assertTrue(response.isEmpty());
    }

    @Test
    void update_ShouldUpdateUser_WhenUserIsFound() {
        UserResponse savedUser = userService.save(createUserRequest);
        UpdateUserMeRequest request = new UpdateUserMeRequest(UPDATED_USERNAME, null);

        UserResponse response = userService.update(savedUser.id(), request);

        assertEquals(USER_EMAIL, response.email());
        assertEquals(UPDATED_USERNAME, response.username());
    }

    @Test
    void update_ThrowsUserNotFound_WhenIdDoesntExist() {
        UpdateUserMeRequest request = new UpdateUserMeRequest(UPDATED_USERNAME, null);

        assertThrows(UserNotFoundException.class, () -> userService.update(NON_MATCHING_ID, request));
    }

    @Test
    void deleteById_ShouldDeleteUser_WhenUserIsValid() {
        UserResponse response = userService.save(createUserRequest);
        userService.deleteById(response.id());
        assertTrue(userService.findById(response.id()).isEmpty());
    }
}
