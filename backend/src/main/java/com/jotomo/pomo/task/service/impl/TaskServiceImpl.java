package com.jotomo.pomo.task.service.impl;

import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.project.repository.ProjectRepository;
import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.task.enums.Status;
import com.jotomo.pomo.task.mapper.TaskMapper;
import com.jotomo.pomo.task.models.Task;
import com.jotomo.pomo.task.repository.TaskRepository;
import com.jotomo.pomo.task.service.TaskService;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final TaskMapper taskMapper;

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasks(UUID userId) {
        UserEntity user = getUser(userId);
        return taskRepository.findTasksByOwner(user)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksFiltered(UUID userId, Status status, UUID projectId) {
        UserEntity user = getUser(userId);

        List<Task> tasks;
        if (projectId != null && status != null) {
            Project project = getProject(user, projectId);
            tasks = taskRepository.findTasksByOwnerAndProjectAndStatus(user, project, status);
        } else if (projectId != null) {
            Project project = getProject(user, projectId);
            tasks = taskRepository.findTasksByOwnerAndProject(user, project);
        } else if (status != null) {
            tasks = taskRepository.findTasksByOwnerAndStatus(user, status);
        } else {
            tasks = taskRepository.findTasksByOwner(user);
        }

        return tasks.stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    public TaskResponse createTask(UUID userId, CreateTaskRequest request) {
        UserEntity user = getUser(userId);

        Project project = null;
        if (request.projectId() != null) {
            project = getProject(user, request.projectId());
        }

        Task parentTask = null;
        if (request.parentTaskId() != null) {
            parentTask = getTask(user, request.parentTaskId());
        }

        Task task = taskMapper.toEntity(request); // mapper solo con request

        task.setOwner(user);
        task.setProject(project);
        task.setParentTask(parentTask);

        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    public TaskResponse updateTask(UUID userId, UUID taskId, UpdateTaskRequest request) {
        UserEntity user = getUser(userId);
        Task task = getTask(user, taskId);

        taskMapper.updateEntity(request, task);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    public void deleteTask(UUID userId, UUID taskId) {
        UserEntity user = getUser(userId);
        Task task = getTask(user, taskId);
        taskRepository.delete(task);
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Task getTask(UserEntity user, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!task.getOwner().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "task does not belong to user");
        }

        return task;
    }

    private Project getProject(UserEntity user, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Project does not belong to user");
        }

        return project;
    }
}
