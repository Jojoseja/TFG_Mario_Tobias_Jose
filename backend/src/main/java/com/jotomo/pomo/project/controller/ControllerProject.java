package com.jotomo.pomo.project.controller;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.project.service.ProjectService;
import com.jotomo.pomo.task.dto.TaskResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.jotomo.pomo.constants.ApiConstants.*;


@RestController
@RequestMapping(PROJECT_PATH)
@RequiredArgsConstructor
@Slf4j
public class ControllerProject {

    private final ProjectService projectService;

    @GetMapping(PATH_ID)
    public List<ProjectResponse> getProjects(
            @RequestHeader(USER_ID_HEADER) UUID id
    ) {
        return projectService.getProjects(id);
    }

    @GetMapping(PATH_ID + "/tasks")
    public List<TaskResponse> getProjectTasks(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable UUID projectId
    ) {
        return projectService.getProjectTasks(id, projectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @Valid @RequestBody CreateProjectRequest request
    ){
        return projectService.createProject(id, request);
    }

    @PatchMapping(PATH_ID)
    public ProjectResponse updateProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateProjectRequest request
    ){
        return projectService.updateProject(id, projectId, request);
    }

    @DeleteMapping(PATH_ID)
    public void deleteProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable UUID projectId
    ){
        projectService.deleteProject(id, projectId);
    }

}
