package com.jotomo.pomo.task.controller;

import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.task.enums.Status;
import com.jotomo.pomo.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.jotomo.pomo.constants.ApiConstants.*;

@RestController
@RequestMapping(TASK_PATH)
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @Valid @RequestBody CreateTaskRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) UUID projectId
    ) {
        return ResponseEntity.ok(taskService.getTasksFiltered(userId, status, projectId));
    }

    @PatchMapping(PATH_ID)
    public ResponseEntity<TaskResponse> updateTask(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @PathVariable("id") UUID taskId,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(userId, taskId, request));
    }

    @DeleteMapping(PATH_ID)
    public ResponseEntity<Void> deleteTask(
            @RequestHeader(USER_ID_HEADER) UUID userId,
            @PathVariable("id") UUID taskId
    ) {
        taskService.deleteTask(userId, taskId);
        return ResponseEntity.noContent().build();
    }
}
