package com.jotomo.pomo.testdata.task;

import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.models.Task;

import static com.jotomo.pomo.testdata.TestSetUp.*;

public class TaskFactory {
    public static Task defaultTask(){
        return Task.builder()
                .title(TASK_TITLE)
                .archived(TASK_ARCHIVED)
                .status(TASK_STATUS)
                .priority(TASK_PRIORITY)
                .build();
    }

    public static TaskResponse defaultTaskResponse(){
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
}
