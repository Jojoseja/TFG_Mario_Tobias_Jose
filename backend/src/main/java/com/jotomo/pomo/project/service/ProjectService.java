package com.jotomo.pomo.project.service;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.task.dto.TaskResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectService {

    List<ProjectResponse> getProjects(UUID userId);

    List<TaskResponse> getProjectTasks(UUID userId, UUID projectId);

    List<TaskResponse> getProjectTasks(UUID userId, ProjectRequest request);

    Optional<ProjectResponse> getProjectByUserAndName(UUID userId, ProjectRequest request);

    ProjectResponse createProject(UUID userId, CreateProjectRequest request);

    ProjectResponse updateProject(UUID userId, UUID projectId, UpdateProjectRequest updateProjectRequest);

    ProjectResponse updateProject(UUID userId, String name, UpdateProjectRequest updateProjectRequest);

    void deleteProject (UUID userId, UUID projectId);

    void deleteProject (UUID userId, String name);

    ProjectResponse latestProject(UUID userId);
}
