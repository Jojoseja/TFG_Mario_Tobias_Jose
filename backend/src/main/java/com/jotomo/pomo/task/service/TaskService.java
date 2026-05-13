package com.jotomo.pomo.task.service;

import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.task.enums.Status;
import com.jotomo.pomo.task.models.Task;
import com.jotomo.pomo.user.model.UserEntity;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(UUID userId, CreateTaskRequest request);

    List<TaskResponse> getTasks(UUID userId);

    Task getTask(UserEntity user, UUID taskId);

    List<TaskResponse> getTasksFiltered(UUID userId, Status status, UUID projectId);

    TaskResponse updateTask(UUID userId, UUID taskId, UpdateTaskRequest request);

    void deleteTask(UUID userId, UUID taskId);
}
