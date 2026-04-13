package com.jotomo.pomo.task;

import com.jotomo.pomo.project.Project;
import com.jotomo.pomo.project.ProjectMapper;
import com.jotomo.pomo.project.ProjectRepository;
import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.user.UserEntity;
import com.jotomo.pomo.user.UserRepository;
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
public class TaskService {
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

    public List<Task> getTaskFiltered(UUID userId, UUID taskId) {

        return null;
    }

    public TaskResponse createTask(UUID userId, CreateTaskRequest request, Project project) {
        UserEntity user = getUser(userId);

        taskRepository.findByOwnerAndTitleAndProject(user, request.title(), project).ifPresent(task -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Task name in this project already exists");
        });

        Task task = taskMapper.toEntity(request, user);
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);


    }

    public TaskResponse updateTask(UUID userId, UUID taskId, UpdateTaskRequest request) {
        UserEntity user = getUser(userId);
        Task task = getTask(user, taskId);

        taskMapper.updateEntity(request, task);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    public void deleteTask(UUID userId, UUID projectId) {
        UserEntity user = getUser(userId);
        Task task = getTask(user, projectId);
        taskRepository.delete(task);
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Task getTask(UserEntity user, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        if (!task.getOwner().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "task does not belong to user");
        }

        return task;
    }
}
