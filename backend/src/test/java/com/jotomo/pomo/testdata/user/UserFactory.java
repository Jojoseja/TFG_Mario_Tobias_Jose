package com.jotomo.pomo.testdata.user;

import com.jotomo.pomo.user.model.UserEntity;

import static com.jotomo.pomo.testdata.TestSetUp.*;

public class UserFactory {
    public static UserEntity createUser(){
        return UserEntity
                .builder()
                .username(USER_USERNAME)
                .password(USER_PASSWORD)
                .email(USER_EMAIL)
                .enabled(USER_ENABLED)
                .role(USER_ROLE)
                .build();
    }
}
