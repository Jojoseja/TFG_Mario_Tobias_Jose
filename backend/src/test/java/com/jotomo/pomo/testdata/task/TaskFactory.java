package com.jotomo.pomo.testdata.task;

import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.task.models.Task;

import static com.jotomo.pomo.testdata.TestSetUp.*;

public class TaskFactory {
    public static Task defaultTask() {
        return Task.builder()
                .title(TASK_TITLE)
                .archived(TASK_ARCHIVED)
                .status(TASK_STATUS)
                .priority(TASK_PRIORITY)
                .build();
    }

    public static TaskResponse defaultTaskResponse() {
        return new TaskResponse(
                null,
                TASK_TITLE,
                null,
                TASK_PRIORITY,
                TASK_STATUS,
                TASK_ARCHIVED,
                null,
                null,
                null,
                null,
                null,
                null);
    }

    public static CreateTaskRequest defaultCreateTaskRequest(){
        return new CreateTaskRequest(
                TASK_TITLE,
                null,
                TASK_PRIORITY,
                TASK_STATUS,
                null,
                null,
                null,
                null
        );
    }

    public static UpdateTaskRequest defaultUpdateTaskRequest(){
        return new UpdateTaskRequest(
                NEW_TASK_TITLE,
                null,
                TASK_PRIORITY,
                TASK_STATUS,
                null,
                null,
                false,
                null,
                null
        );
    }
}
