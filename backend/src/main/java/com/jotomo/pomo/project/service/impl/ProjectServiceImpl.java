package com.jotomo.pomo.project.service.impl;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.project.mapper.ProjectMapper;
import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.project.repository.ProjectRepository;
import com.jotomo.pomo.project.service.ProjectService;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.mapper.TaskMapper;
import com.jotomo.pomo.task.models.Task;
import com.jotomo.pomo.task.repository.TaskRepository;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ProjectMapper projectMapper;
    private final TaskMapper taskMapper;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(UUID userId) {
        log.debug("Finding projects: userId={}", userId);

        UserEntity user = getUser(userId);

        List<ProjectResponse> projects = projectRepository.findByOwner(user)
                .stream()
                .map(projectMapper::toResponse)
                .toList();

        log.debug("Projects found: userId={}, count={}", userId, projects.size());

        return projects;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getProjectTasks(UUID userId, UUID projectId) {
        log.debug("Finding project tasks: userId={}, projectId={}", userId, projectId);

        UserEntity user = getUser(userId);
        Project project = getProject(user, projectId);

        List<TaskResponse> tasks = taskRepository.findTasksByOwnerAndProject(user, project)
                .stream()
                .map(taskMapper::toResponse)
                .toList();

        log.debug("Project tasks found: userId={}, projectId={}, count={}",
                userId,
                projectId,
                tasks.size()
        );

        return tasks;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getProjectTasks(UUID userId, ProjectRequest request) {
        UserEntity user = getUser(userId);
        Project project = getProject(user, request.name());
        return taskRepository.findTasksByOwnerAndProject(user, project)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<ProjectResponse> getProjectByUserAndName(UUID userId, ProjectRequest request) {
        log.debug("Finding project by name: userId={}, projectName={}", userId, request.name());

        UserEntity user = getUser(userId);

        Optional<ProjectResponse> project = projectRepository.findByOwnerAndName(user, request.name())
                .map(projectMapper::toResponse);

        project.ifPresentOrElse(
                response -> log.debug("Project found by name: userId={}, projectName={}, projectId={}",
                        userId,
                        request.name(),
                        response.id()
                ),
                () -> log.debug("Project not found by name: userId={}, projectName={}",
                        userId,
                        request.name()
                )
        );

        return project;
    }

    public ProjectResponse createProject(UUID userId, CreateProjectRequest request) {
        log.info("Creating project: userId={}, projectName={}", userId, request.name());

        UserEntity user = getUser(userId);

        projectRepository.findByOwnerAndName(user, request.name()).ifPresent(project -> {
            log.warn("Project creation rejected: duplicate project name, userId={}, projectName={}",
                    userId,
                    request.name()
            );

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Project name already exists");
        });

        Project project = projectMapper.toEntity(request, user);
        Project saved = projectRepository.save(project);

        log.info("Project created: userId={}, projectId={}, projectName={}",
                userId,
                saved.getId(),
                saved.getName()
        );

        return projectMapper.toResponse(saved);
    }

    public ProjectResponse updateProject(UUID userId, UUID projectId, UpdateProjectRequest request) {
        log.info("Updating project: userId={}, projectId={}", userId, projectId);

        UserEntity user = getUser(userId);
        Project project = getProject(user, projectId);

        projectRepository.findByOwnerAndName(user, request.name()).ifPresent(searchedProject -> {
            if (!searchedProject.getId().equals(project.getId())) {
                log.warn("Project update rejected: duplicate project name, userId={}, projectId={}, requestedName={}",
                        userId,
                        projectId,
                        request.name()
                );

                throw new ResponseStatusException(HttpStatus.CONFLICT, "Project name already exists");
            }
        });

        projectMapper.updateEntity(request, project);

        Project updatedProject = projectRepository.save(project);

        log.info("Project updated: userId={}, projectId={}, projectName={}",
                userId,
                updatedProject.getId(),
                updatedProject.getName()
        );

        return projectMapper.toResponse(updatedProject);
    }

    public ProjectResponse updateProject(UUID userId, String name, UpdateProjectRequest request) {
        UserEntity user = getUser(userId);

        Project project = getProject(user, name);

        projectRepository.findByOwnerAndName(user, request.name()).ifPresent(searchedProject -> {
            if (!searchedProject.getName().equals(project.getName())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Project name already exists");
            }
        });

        projectMapper.updateEntity(request, project);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    public void deleteProject(UUID userId, UUID projectId) {
        log.info("Deleting project: userId={}, projectId={}", userId, projectId);

        UserEntity user = getUser(userId);
        Project project = getProject(user, projectId);

        user.getProjects().remove(project);
        projectRepository.delete(project);

        log.info("Project deleted: userId={}, projectId={}", userId, projectId);
    }

    public void deleteProject(UUID userId, String name) {
        UserEntity user = getUser(userId);
        Project project = getProject(user, name);
        user.getProjects().remove(project);
        projectRepository.delete(project);
    }

    public ProjectResponse latestProject(UUID userId) {
        log.info("Fetching latest worked project for user {}", userId);

        UserEntity user = getUser(userId);

        Optional<Task> task = taskRepository.findTopByOwnerAndCompletedAtIsNotNullOrderByCompletedAtDesc(user);
        Project project = task.orElseThrow(() -> {
            log.info("No such task was found for user {}", userId);
            return new NoSuchElementException();
        }).getProject();

        return projectMapper.toResponse(project);
    }

    private UserEntity getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User lookup rejected: user not found, userId={}", userId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
    }

    private Project getProject(UserEntity user, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> {
                    log.warn("Project lookup rejected: project not found, userId={}, projectId={}",
                            user.getId(),
                            projectId
                    );

                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        if (!project.getOwner().getId().equals(user.getId())) {
            log.warn("Project access rejected: project does not belong to user, userId={}, projectId={}, ownerId={}",
                    user.getId(),
                    projectId,
                    project.getOwner().getId()
            );

            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Project does not belong to user");
        }

        return project;
    }

    private Project getProject(UserEntity user, String projectName) {
        Project project = projectRepository.findByOwnerAndName(user, projectName)
                .orElseThrow(() -> {
                    log.warn("Project lookup rejected: project not found, userId={}, projectName={}",
                            user.getId(),
                            projectName
                    );

                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        if (!project.getOwner().getId().equals(user.getId())) {
            log.warn("Project access rejected: project does not belong to user, userId={}, projectId={}, ownerId={}",
                    user.getId(),
                    project.getId(),
                    project.getOwner().getId()
            );

            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Project does not belong to user");
        }

        return project;
    }
}
