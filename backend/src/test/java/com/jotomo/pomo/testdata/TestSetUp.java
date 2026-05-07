package com.jotomo.pomo.testdata;

import com.jotomo.pomo.task.enums.Priority;
import com.jotomo.pomo.task.enums.Status;
import com.jotomo.pomo.user.enums.UserRole;
import com.jotomo.pomo.user.model.UserEntity;

import java.time.LocalDateTime;
import java.util.UUID;

public class TestSetUp {

    public static final String USER_USERNAME = "sampleusername";
    public static final String USER_PASSWORD = "userpassword123";
    public static final String USER_EMAIL = "sample@test.com";
    public static final boolean USER_ENABLED = true;
    public static final UserRole USER_ROLE = UserRole.USER;

    public static final UUID NON_MATCHING_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    public static final String NON_MATCHING_EMAIL = "nonmatching@email.com";
    public static final String NON_MATCHING_PASSWORD = "nonmatchingpassword123";
    public static final String UPDATED_USERNAME = "newusername";
    public static final String SECOND_USERNAME = "newerusername";
    public static final String SECOND_EMAIL = "second@email.com";

    public static final String TASK_TITLE = "Task Title";
    public static final Status TASK_STATUS = Status.TODO;
    public static final Priority TASK_PRIORITY = Priority.LOW;
    public static final Status NON_MATCHING_TASK_STATUS = Status.IN_PROGRESS;

    public static final String PROJECT_NAME = "Project Name";

    public static final LocalDateTime SESSION_STARTED_AT = LocalDateTime.of(10,10,10,10,10,10);

    public static final int SESSIONCONFIGURATION_WORKDURATION = 25;
    public static final int SESSIONCONFIGURATION_SHORTBREAKDURATION = 5;
    public static final int SESSIONCONFIGURATION_LONGBREAKDURATION = 15;
    public static final int SESSIONCONFIGURATION_CYCLESBEFOREBREAK = 3;

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
