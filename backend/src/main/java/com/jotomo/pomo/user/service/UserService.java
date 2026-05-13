package com.jotomo.pomo.user.service;

import com.jotomo.pomo.user.dto.CreateUserRequest;
import com.jotomo.pomo.user.dto.UpdateUserMeRequest;
import com.jotomo.pomo.user.dto.UserResponse;

import java.util.Optional;
import java.util.UUID;

public interface UserService {

    UserResponse save(final CreateUserRequest request);

    Optional<UserResponse> findById(final UUID userId);

    Optional<UserResponse> findByEmail(final String email);

    UserResponse update(final UUID userId, UpdateUserMeRequest request);

    void deleteById(final UUID userId);
}
