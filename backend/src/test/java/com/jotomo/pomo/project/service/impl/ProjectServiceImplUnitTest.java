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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static com.jotomo.pomo.testdata.TestSetUp.*;
import static com.jotomo.pomo.testdata.project.ProjectFactory.*;
import static com.jotomo.pomo.testdata.task.TaskFactory.defaultTask;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ProjectServiceImplUnitTest {

    @Autowired
    private ProjectMapper projectMapper;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private TaskMapper taskMapper;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    private UserEntity userEntity = createUser();
    private Project project = defaultProject();
    private List<ProjectResponse> projectResponseList = List.of();


    @BeforeEach
    void setUp(){

    }

    @Test
    void getProject_ReturnsList_WhenUserHasProjects(){
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);

        projectResponseList = projectService.getProjects(userEntity.getId());

        assertEquals(projectMapper.toResponse(project), projectResponseList.getFirst());
    }

    @Test
    void getProjects_ReturnsEmpty_WhenUserHasNoProjects() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());

        assertTrue(projectService.getProjects(userEntity.getId()).isEmpty());
    }

    @Test
    void getProjectTasks_ReturnList_WhenUserHasTasks() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);
        Task task = defaultTask();
        project.getTasks().add(task);
        task.setProject(project);
        userEntity.getTasks().add(task);
        task.setOwner(userEntity);
        taskRepository.saveAndFlush(task);

        assertEquals(taskMapper.toResponse(task), projectService.getProjectTasks(userEntity.getId(), project.getId()).getFirst());
    }

    @Test
    void getProjectTasksWithName_ReturnList_WhenUserHasTasks() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);
        Task task = defaultTask();
        project.getTasks().add(task);
        task.setProject(project);
        userEntity.getTasks().add(task);
        task.setOwner(userEntity);
        taskRepository.saveAndFlush(task);
        ProjectRequest request = defaultProjectRequest();

        assertEquals(taskMapper.toResponse(task), projectService.getProjectTasks(userEntity.getId(), request).getFirst());
    }

    @Test
    void getProjectTasks_ReturnEmpty_WhenUserHasNoTasks() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);

        assertTrue(projectService.getProjectTasks(userEntity.getId(), project.getId()).isEmpty());
    }

    @Test
    void createProject_ShouldSaveToDatabase_WhenRequestIsValid(){
        userEntity = userRepository.save(userEntity);
        CreateProjectRequest request = defaultCreateProjectRequest();

        assertNotNull(projectService.createProject(userEntity.getId(), request));
    }

    @Test
    void createProject_ThrowsResponseStatusException_WhenNameAlreadyExists(){
        userEntity = userRepository.save(userEntity);
        CreateProjectRequest request = defaultCreateProjectRequest();
        projectService.createProject(userEntity.getId(), request);

        assertThrows(ResponseStatusException.class, () -> projectService.createProject(userEntity.getId(), request));
    }

    @Test
    void updateProject_ShouldUpdateProject_WhenNameIsValid() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);

        assertEquals(NEW_PROJECT_NAME, projectService.updateProject(userEntity.getId(), project.getId(), defaultUpdateProjectRequest()).name());
    }

    @Test
    void updateProjectWithName_ShouldUpdateProject_WhenNameIsValid() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);

        assertEquals(NEW_PROJECT_NAME, projectService.updateProject(userEntity.getId(), PROJECT_NAME, defaultUpdateProjectRequest()).name());
    }

    @Test
    void updateProject_ThrowsResponseStatusException_WhenNameAlreadyExists() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);
        CreateProjectRequest newRequest = new CreateProjectRequest(NEW_PROJECT_NAME, PROJECT_DESCRIPTION);
        projectService.createProject(userEntity.getId(), newRequest);

        UpdateProjectRequest request = new UpdateProjectRequest(NEW_PROJECT_NAME, PROJECT_DESCRIPTION);

        assertThrows(ResponseStatusException.class, () -> projectService.updateProject(userEntity.getId(), project.getId(), request));
    }

    @Test
    void deleteProject_ShouldDeleteProject_WhenProjectExists() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);

        projectService.deleteProject(userEntity.getId(), project.getId());

        assertFalse(projectRepository.existsById(project.getId()));
    }

    @Test
    void deleteProjectWithName_ShouldDeleteProject_WhenProjectExists() {
        userEntity = userRepository.save(userEntity);
        projectService.getProjects(userEntity.getId());
        userEntity.getProjects().add(project);
        project.setOwner(userEntity);
        project = projectRepository.save(project);

        projectService.deleteProject(userEntity.getId(), project.getName());

        assertFalse(projectRepository.existsById(project.getId()));
    }
}