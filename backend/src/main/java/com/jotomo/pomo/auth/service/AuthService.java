package com.jotomo.pomo.auth.service;

import com.jotomo.pomo.auth.dto.LoginRequest;
import com.jotomo.pomo.user.dto.UserResponse;

public interface AuthService {

    UserResponse login (final LoginRequest request);
}
