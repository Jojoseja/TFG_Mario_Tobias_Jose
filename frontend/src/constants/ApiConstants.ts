export class ApiConstants {
    static readonly BASE_PATH = "http://localhost:8080/api/v1";

    static readonly AUTH_PATH = ApiConstants.BASE_PATH + "/auth";
    static readonly USER_PATH = ApiConstants.BASE_PATH + "/user";
    static readonly TASK_PATH = ApiConstants.BASE_PATH + "/task";
    static readonly PROJECT_PATH = ApiConstants.BASE_PATH + "/project";
    static readonly SESSION_PATH = ApiConstants.BASE_PATH + "/session";
    static readonly SESSION_CONFIGURATION_PATH = ApiConstants.BASE_PATH + "/session-configuration";
    static readonly POMODORO = ApiConstants.BASE_PATH + "/pomodoro";

    static readonly USER_ID_HEADER = "X-User-Id";

    static readonly PATH_ID = "/{id}";
    static readonly LOGIN = "/login";
}