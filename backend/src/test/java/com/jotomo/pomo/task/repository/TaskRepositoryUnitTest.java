package com.jotomo.pomo.task.repository;

import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.project.repository.ProjectRepository;
import com.jotomo.pomo.task.models.Task;
import com.jotomo.pomo.testdata.TestSetUp;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static com.jotomo.pomo.testdata.TestSetUp.USER_ENABLED;
import static com.jotomo.pomo.testdata.TestSetUp.USER_ROLE;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class TaskRepositoryUnitTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private UserEntity userEntity;

    private Task task;

    private final List<Task> taskList = new ArrayList<>();

    private Project project;

    @BeforeEach
    void setUp() {
        userEntity = TestSetUp.createUser();
        userRepository.save(userEntity);
    }

    @Test
    void findByOwnerAndTitleAndProject_ReturnTask_WhenTaskExists() {
        createTask();
        createProject();
        task.setProject(project);
        assertEquals(task, taskRepository.findByOwnerAndTitleAndProject(userEntity, TASK_TITLE, project).get());
    }

    @Test
    void findByOwnerAndTitleAndProject_ReturnEmpty_WhenTaskDoesNotExist() {
        createTask();
        createProject();
        assertTrue(taskRepository.findByOwnerAndTitleAndProject(userEntity, TASK_TITLE, project).isEmpty());
    }

    @Test
    void findTasksByOwner_ReturnTaskList_WhenOwnerExistsAndHasTasks() {
        createTask();
        taskRepository.save(task);
        taskList.add(task);
        assertEquals(taskList, taskRepository.findTasksByOwner(userEntity));
        taskList.clear();
    }

    @Test
    void findTasksByOwner_ReturnEmpty_WhenOwnerDoesNotHaveTasks() {
        assertTrue(taskRepository.findTasksByOwner(userEntity).isEmpty());
    }

    @Test
    void findTasksByOwnerAndProject_ReturnList_WhenOwnerHasTasksInProject() {
        createTask();
        createProject();
        task.setProject(project);
        taskList.add(task);
        assertEquals(taskList, taskRepository.findTasksByOwnerAndProject(userEntity, project));
    }

    @Test
    void findTasksByOwnerAndProject_ReturnEmpty_WhenOwnerHasNoTasksInProject() {
        createTask();
        createProject();
        assertEquals(taskList, taskRepository.findTasksByOwnerAndProject(userEntity, project));
    }

    @Test
    void findTasksByOwnerAndProjectAndStatus_ReturnList_WhenMatching() {
        createTask();
        createProject();
        task.setProject(project);
        taskList.add(task);
        assertEquals(taskList, taskRepository.findTasksByOwnerAndProjectAndStatus(userEntity, project, TASK_STATUS));
    }

    @Test
    void findTasksByOwnerAndProjectAndStatus_ReturnEmptyWhenNoMatchingStatus() {
        createTask();
        createProject();
        task.setProject(project);
        assertEquals(taskList, taskRepository.findTasksByOwnerAndProjectAndStatus(userEntity, project, NON_MATCHING_TASK_STATUS));
    }

    @Test
    void findTasksByOwnerAndProjectAndStatus_ReturnEmptyWhenNoMatchingProject() {
        createTask();
        createProject();
        assertEquals(taskList, taskRepository.findTasksByOwnerAndProjectAndStatus(userEntity, project, TASK_STATUS));
    }

    @Test
    void findTasksByOwnerAndStatus_ReturnList_WhenMatching() {
        createTask();
        taskList.add(task);
        assertEquals(taskList, taskRepository.findTasksByOwnerAndStatus(userEntity, TASK_STATUS));
    }

    @Test
    void findTasksByOwnerAndStatus_ReturnEmpty_WhenNotMatching() {
        createTask();
        assertEquals(taskList, taskRepository.findTasksByOwnerAndStatus(userEntity, NON_MATCHING_TASK_STATUS));
    }

    void createTask() {
        task = Task.builder()
                .title(TASK_TITLE)
                .owner(userEntity)
                .status(TASK_STATUS)
                .priority(TASK_PRIORITY)
                .build();
        taskRepository.save(task);
    }

    void createProject() {
        project = Project.builder()
                .name(PROJECT_NAME)
                .owner(userEntity)
                .build();
        projectRepository.save(project);
    }
}
