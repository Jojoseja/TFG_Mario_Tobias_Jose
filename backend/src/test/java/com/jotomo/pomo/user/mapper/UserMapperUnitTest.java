package com.jotomo.pomo.user.mapper;

import com.jotomo.pomo.auth.dto.LoginRequest;
import com.jotomo.pomo.user.dto.CreateUserRequest;
import com.jotomo.pomo.user.dto.UpdateUserMeRequest;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.model.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserMapperUnitTest {

    @Autowired
    private UserMapper userMapper;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = createUser();
    }

    @Test
    void toResponse_ReturnsUserResponse_WhenValid() {
        UserResponse response;

        response = userMapper.toResponse(user);

        assertEquals(user.getId(), response.id());
        assertEquals(user.getUsername(), response.username());
        assertEquals(user.getEmail(), response.email());
        assertEquals(user.isEnabled(), response.enabled());
        assertEquals(user.getRole(), response.role());
    }

    @Test
    void CreateUserRequestToEntity_ReturnUserEntity_WhenRequestIsValid() {
        CreateUserRequest request = new CreateUserRequest(USER_USERNAME, USER_EMAIL, USER_PASSWORD);

        UserEntity user = userMapper.toEntity(request);

        assertEquals(request.email(), user.getEmail());
        assertEquals(request.username(), user.getUsername());
        assertEquals(request.password(), user.getPassword());
    }

    @Test
    void LoginRequestToEntity_ReturnUserEntity_WhenRequestIsValid() {
        LoginRequest request = new LoginRequest(USER_USERNAME, USER_PASSWORD);

        UserEntity user = userMapper.toEntity(request);

        assertEquals(request.email(), user.getEmail());
        assertEquals(request.password(), user.getPassword());
    }

    @Test
    void updateEntity_ShouldUpdateUser_WhenRequestIsValid() {
        UpdateUserMeRequest request = new UpdateUserMeRequest(UPDATED_USERNAME, USER_EMAIL);

        userMapper.updateEntity(request, user);

        assertEquals(request.email(), user.getEmail());
        assertEquals(request.username(), user.getUsername());
    }
}