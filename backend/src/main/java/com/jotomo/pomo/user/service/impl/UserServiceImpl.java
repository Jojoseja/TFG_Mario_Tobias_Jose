package com.jotomo.pomo.user.service.impl;

import com.jotomo.pomo.exception.UserAlreadyExistsException;
import com.jotomo.pomo.exception.UserNotFoundException;
import com.jotomo.pomo.sessionconfiguration.factory.SessionConfigurationFactory;
import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import com.jotomo.pomo.user.dto.CreateUserRequest;
import com.jotomo.pomo.user.dto.UpdateUserMeRequest;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.enums.UserRole;
import com.jotomo.pomo.user.mapper.UserMapper;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import com.jotomo.pomo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SessionConfigurationFactory sessionConfigurationFactory;

    @Override
    public UserResponse save(CreateUserRequest request) {
        log.info("Creating user: email={}", request.email());

        UserEntity userEntity = userMapper.toEntity(request);

        if (userRepository.existsByEmail(userEntity.getEmail())) {
            log.warn("User creation rejected: email already exists, email={}", userEntity.getEmail());
            throw new UserAlreadyExistsException();
        }

        userEntity.setEnabled(true);
        userEntity.setRole(UserRole.USER);

        SessionConfiguration sessionConfiguration = sessionConfigurationFactory.defaultConfiguration();
        userEntity.setSessionConfiguration(sessionConfiguration);
        sessionConfiguration.setUser(userEntity);

        UserEntity saved = userRepository.save(userEntity);

        log.info("User created: userId={}, email={}", saved.getId(), saved.getEmail());

        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserResponse> findById(UUID userId) {
        log.debug("Finding user by id: userId={}", userId);

        return userRepository.findById(userId)
                .map(user -> {
                    log.debug("User found by id: userId={}", userId);
                    return userMapper.toResponse(user);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserResponse> findByEmail(String email) {
        log.debug("Finding user by email: email={}", email);

        return userRepository.findByEmail(email)
                .map(user -> {
                    log.debug("User found by email: userId={}, email={}", user.getId(), email);
                    return userMapper.toResponse(user);
                });
    }

    @Override
    public UserResponse update(UpdateUserMeRequest request) {
        log.info("Updating user: email={}", request.email());

        UserEntity user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("User update rejected: user not found, email={}", request.email());
                    return new UserNotFoundException();
                });

        userMapper.updateEntity(request, user);

        log.info("User updated: userId={}, email={}", user.getId(), user.getEmail());

        return userMapper.toResponse(user);
    }

    @Override
    public void deleteById(UUID userId) {
        log.info("Deleting user: userId={}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User deletion rejected: user not found, userId={}", userId);
                    return new UserNotFoundException();
                });

        userRepository.delete(user);

        log.info("User deleted: userId={}", userId);
    }
}
