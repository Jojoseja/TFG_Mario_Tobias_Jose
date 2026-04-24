package com.jotomo.pomo.project.service;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.task.dto.TaskResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    List<ProjectResponse> getProjects(UUID userId);

    List<TaskResponse> getProjectTasks(UUID userId, UUID projectId);

    ProjectResponse createProject(UUID userId, CreateProjectRequest request);

    ProjectResponse updateProject(UUID userId, UUID projectId, UpdateProjectRequest updateProjectRequest);

    void deleteProject (UUID userId, UUID projectId);
}
