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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SessionConfigurationFactory sessionConfigurationFactory;

    @Override
    public UserResponse save(CreateUserRequest request) {
        UserEntity userEntity = userMapper.toEntity(request);
        if (userRepository.existsByEmail(userEntity.getEmail())){
            throw new UserAlreadyExistsException();
        } else {
            userEntity.setEnabled(true);
            userEntity.setRole(UserRole.USER);
            SessionConfiguration sessionConfiguration = sessionConfigurationFactory.defaultConfiguration();
            userEntity.setSessionConfiguration(sessionConfiguration);
            sessionConfiguration.setUser(userEntity);
        }
        return userMapper.toResponse(userRepository.save(userEntity));
    }

    @Override
    public Optional<UserResponse> findById(UUID userId) {
        return userRepository.findById(userId).map(userMapper::toResponse);
    }

    @Override
    public Optional<UserResponse> findByEmail(String email) {
        return userRepository.findByEmail(email).map(userMapper::toResponse);
    }

    @Override
    public UserResponse update(UpdateUserMeRequest request) {
        UserEntity user = userRepository.findByEmail(request.email()).orElseThrow(UserNotFoundException::new);
        userMapper.updateEntity(request, user);
        return userMapper.toResponse(user);
    }

    @Override
    public void deleteById(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException();
        }
        userRepository.deleteById(userId);
    }
}
