package com.jotomo.pomo.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ApiConstants {

    public static final String BASE_PATH = "/api/v1";

    public static final String AUTH_PATH = BASE_PATH + "/auth";
    public static final String USER_PATH = BASE_PATH + "/user";
    public static final String TASK_PATH = BASE_PATH + "/task";
    public static final String PROJECT_PATH = BASE_PATH + "/project";
    public static final String SESSION_PATH = BASE_PATH + "/session";
    public static final String SESSION_CONFIGURATION_PATH = BASE_PATH + "/session-configuration";
    public static final String POMODORO = BASE_PATH + "/pomodoro";

    public static final String PATH_ID = "/{id}";
}
