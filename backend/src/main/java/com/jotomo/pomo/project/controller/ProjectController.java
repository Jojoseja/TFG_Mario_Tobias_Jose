package com.jotomo.pomo.project.controller;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.project.service.ProjectService;
import com.jotomo.pomo.task.dto.TaskResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.jotomo.pomo.constants.ApiConstants.*;

@RestController
@RequestMapping(PROJECT_PATH)
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping()
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @RequestHeader(USER_ID_HEADER) UUID id
    ) {
        return ResponseEntity.ok(projectService.getProjects(id));
    }

    @GetMapping("/name")
    public ResponseEntity<ProjectResponse> getProjectByName(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @Valid @RequestBody ProjectRequest request
            ) {
        return projectService.getProjectByUserAndName(id, request)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "There is no project with such name"
                ));
    }

    @GetMapping(PATH_ID + "/tasks")
    public ResponseEntity<List<TaskResponse>> getProjectTasks(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable("id") UUID projectId
    ) {
        return ResponseEntity.ok(projectService.getProjectTasks(id, projectId));
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getProjectTasks(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @RequestBody ProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.getProjectTasks(id, request));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ProjectResponse> createProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @Valid @RequestBody CreateProjectRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(id, request));
    }

    @PatchMapping(PATH_ID)
    public ResponseEntity<ProjectResponse> updateProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable("id") UUID projectId,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, projectId, request));
    }

    @PatchMapping("name/{name}")
    public ResponseEntity<ProjectResponse> updateProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable String name,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, name, request));
    }

    @DeleteMapping(PATH_ID)
    public ResponseEntity<Void> deleteProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable("id") UUID projectId
    ) {
        projectService.deleteProject(id, projectId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/name/{name}")
    public ResponseEntity<Void> deleteProject(
            @RequestHeader(USER_ID_HEADER) UUID id,
            @PathVariable String name
    ) {
        projectService.deleteProject(id, name);
        return ResponseEntity.noContent().build();
    }

}
