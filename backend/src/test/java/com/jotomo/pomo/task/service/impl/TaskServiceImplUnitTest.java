package com.jotomo.pomo.task.service.impl;

import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.project.repository.ProjectRepository;
import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.task.mapper.TaskMapper;
import com.jotomo.pomo.task.models.Task;
import com.jotomo.pomo.task.repository.TaskRepository;
import com.jotomo.pomo.task.service.TaskService;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static com.jotomo.pomo.testdata.TestSetUp.TASK_STATUS;
import static com.jotomo.pomo.testdata.project.ProjectFactory.defaultProject;
import static com.jotomo.pomo.testdata.task.TaskFactory.*;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class TaskServiceImplUnitTest {

    private Task task = defaultTask();
    private List<Task> taskList = new ArrayList<>();
    @Autowired
    private TaskService taskService;
    @Autowired
    private TaskMapper taskMapper;
    @Autowired
    private TaskRepository taskRepository;
    private CreateTaskRequest createTaskRequest = defaultCreateTaskRequest();
    private UpdateTaskRequest updateTaskRequest = defaultUpdateTaskRequest();
    private TaskResponse taskResponse = defaultTaskResponse();
    @Autowired
    private UserRepository userRepository;
    private Project project = defaultProject();
    @Autowired
    private ProjectRepository projectRepository;

    private UserEntity user = createUser();

    @Test
    void getTasks_ReturnTaskResponseList_WhenValid() {
        user.getTasks().add(task);
        task.setOwner(user);
        taskList.add(task);
        userRepository.save(user);
        taskRepository.saveAndFlush(task);

        assertEquals(taskList.stream()
                .map(taskMapper::toResponse)
                .toList(),
                taskService.getTasks(user.getId()));
    }

    @Test
    void getTasksFiltered_ReturnsTaskResponse_WhenValid() {
        user.getTasks().add(task);
        task.setOwner(user);
        project.setOwner(user);
        user.getProjects().add(project);
        project.getTasks().add(task);
        task.setProject(project);
        taskList.add(task);
        userRepository.save(user);
        projectRepository.save(project);
        taskRepository.saveAndFlush(task);
        project = projectRepository.saveAndFlush(project);


        assertEquals(taskList.stream()
                        .map(taskMapper::toResponse)
                        .toList(),
                taskService.getTasksFiltered(user.getId(),TASK_STATUS, project.getId()));
    }

    @Test
    void createTask_ShouldCreateTask_WhenValid() {
        user.getTasks().add(task);
        task.setOwner(user);
        userRepository.saveAndFlush(user);

        taskResponse = taskService.createTask(user.getId(), createTaskRequest);

        assertEquals(createTaskRequest.title(), taskResponse.title());
    }

    @Test
    void updateTask_ShouldUpdateTask_WhenValid() {
        user.getTasks().add(task);
        task.setOwner(user);
        userRepository.saveAndFlush(user);
        taskRepository.saveAndFlush(task);

        taskResponse = taskService.updateTask(user.getId(), task.getId(), updateTaskRequest);

        assertEquals(updateTaskRequest.title(), taskResponse.title());
    }

    @Test
    void deleteTask_ShouldDeleteTask_WhenValid() {
        user.getTasks().add(task);
        task.setOwner(user);
        userRepository.saveAndFlush(user);
        taskRepository.saveAndFlush(task);

        taskService.deleteTask(user.getId(), task.getId());

        assertThrows(ResponseStatusException.class, () -> taskService.getTask(user, task.getId()));
    }
}