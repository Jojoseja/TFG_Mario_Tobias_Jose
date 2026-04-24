package com.jotomo.pomo.project.service.impl;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.project.mapper.ProjectMapper;
import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.project.repository.ProjectRepository;
import com.jotomo.pomo.project.service.ProjectService;
import com.jotomo.pomo.task.mapper.TaskMapper;
import com.jotomo.pomo.task.repository.TaskRepository;
import com.jotomo.pomo.task.dto.TaskResponse;
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
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    private final TaskRepository taskRepository;

    private final ProjectMapper projectMapper;

    private final TaskMapper taskMapper;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(UUID userId) {
        UserEntity user = getUser(userId);
        return projectRepository.findByOwner(user)
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getProjectTasks(UUID userId, UUID projectId) {
        UserEntity user = getUser(userId);
        Project project = getProject(user, projectId);
        return taskRepository.findTasksByOwnerAndProject(user, project)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    public ProjectResponse createProject(UUID userId, CreateProjectRequest request) {
        UserEntity user = getUser(userId);

        projectRepository.findByOwnerAndName(user, request.name()).ifPresent(project -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Project name already exists");
        });

        Project project = projectMapper.toEntity(request, user);
        Project saved = projectRepository.save(project);
        return projectMapper.toResponse(saved);
    }

    public ProjectResponse updateProject(UUID userId, UUID projectId, UpdateProjectRequest request) {
        UserEntity user = getUser(userId);

        Project project = getProject(user, projectId);

        projectMapper.updateEntity(request, project);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    public void deleteProject(UUID userId, UUID projectId) {
        UserEntity user = getUser(userId);
        Project project = getProject(user, projectId);
        projectRepository.delete(project);
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
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
