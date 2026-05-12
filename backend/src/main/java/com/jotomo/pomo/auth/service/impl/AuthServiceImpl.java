package com.jotomo.pomo.auth.service.impl;

import com.jotomo.pomo.auth.dto.LoginRequest;
import com.jotomo.pomo.auth.service.AuthService;
import com.jotomo.pomo.exception.IncorrectPassword;
import com.jotomo.pomo.exception.UserNotFoundException;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.mapper.UserMapper;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.email()).orElseThrow(UserNotFoundException::new);
        if (user.getPassword().equals(request.password())) {
            log.info("User {} logged in", user.getId());
            return userMapper.toResponse(user);
        } else {
            log.warn("User {} used an incorrect password", user.getId());
            throw new IncorrectPassword();
        }
    }
}
