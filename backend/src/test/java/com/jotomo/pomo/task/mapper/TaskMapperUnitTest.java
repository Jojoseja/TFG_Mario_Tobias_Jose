package com.jotomo.pomo.task.mapper;

import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.task.models.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static com.jotomo.pomo.testdata.project.ProjectFactory.defaultProject;
import static com.jotomo.pomo.testdata.task.TaskFactory.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class TaskMapperUnitTest {

    private Project project = defaultProject();
    private Task task = defaultTask();
    private TaskResponse taskResponse;
    private CreateTaskRequest createTaskRequest = defaultCreateTaskRequest();
    private UpdateTaskRequest updateTaskRequest = defaultUpdateTaskRequest();
    @Autowired
    private TaskMapper taskMapper;

    @Test
    void toResponse_ShouldMapToResponse_WhenValid() {
        taskResponse = taskMapper.toResponse(task);

        assertEquals(task.getTitle(), taskResponse.title());
        assertEquals(task.getDescription(), taskResponse.description());
        assertEquals(task.isArchived(), taskResponse.archived());
        assertEquals(task.getStatus(), taskResponse.status());
        assertEquals(task.getPriority(), taskResponse.priority());
    }

    @Test
    void toEntity_ShouldMapToEntity_WhenValid() {
        Task newTask = taskMapper.toEntity(createTaskRequest);

        assertEquals(createTaskRequest.title(), newTask.getTitle());
        assertEquals(createTaskRequest.description(), newTask.getDescription());
        assertEquals(createTaskRequest.status(), newTask.getStatus());
        assertEquals(createTaskRequest.priority(), newTask.getPriority());
    }

    @Test
    void updateEntity_ShouldUpdateEntity_WhenValid() {
        taskMapper.updateEntity(updateTaskRequest, task);

        assertEquals(updateTaskRequest.title(), task.getTitle());
    }
}