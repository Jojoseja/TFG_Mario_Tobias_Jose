package com.jotomo.pomo.user.controller;

import com.jotomo.pomo.exception.UserNotFoundException;
import com.jotomo.pomo.testdata.TestSetUp;
import com.jotomo.pomo.user.dto.CreateUserRequest;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserControllerUnitTest {

    @Autowired
    private UserController userController;
    @Autowired
    private UserService userService;
    private UserEntity user;
    private CreateUserRequest createUserRequest;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        user = TestSetUp.createUser();
        createUserRequest = new CreateUserRequest(
                SECOND_USERNAME,
                SECOND_EMAIL,
                user.getPassword()
        );
    }

    @Test
    void createUser_ReturnsCreatedUser_WhenRequestIsValid() {
        ResponseEntity<UserResponse> response = userController.createUser(createUserRequest);
        userResponse = userService.findByEmail(SECOND_EMAIL).get();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(userResponse.email() ,response.getBody().email());
    }

    @Test
    void findUserById_ReturnsUser_WhenUserExists() {
        userService.save(createUserRequest);
        userResponse = userService.findByEmail(createUserRequest.email()).get();

        ResponseEntity<UserResponse> response = userController.findUserById(userResponse.id());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userResponse, response.getBody());
    }

    @Test
    void findUserById_ThrowsUserNotFoundException_WhenUserDoesNotExist() {
        assertThrows(UserNotFoundException.class, () -> userController.findUserById(NON_MATCHING_ID));
    }

    @Test
    void findUserByEmail_ReturnsUser_WhenUserExists() {
        userService.save(createUserRequest);
        userResponse = userService.findByEmail(createUserRequest.email()).get();

        ResponseEntity<UserResponse> response = userController.findUserByEmail(userResponse.email());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userResponse, response.getBody());
    }

    @Test
    void deleteUser() {
        userService.save(createUserRequest);
        userResponse = userService.findByEmail(createUserRequest.email()).get();
        ResponseEntity<Void> response = userController.deleteUser(userResponse.id());

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }
}