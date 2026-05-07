package com.jotomo.pomo.project.mapper;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.user.model.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static com.jotomo.pomo.testdata.TestSetUp.NEW_PROJECT_NAME;
import static com.jotomo.pomo.testdata.project.ProjectFactory.*;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ProjectMapperUnitTest {

    private final Project project = defaultProject();
    private final ProjectRequest projectRequest = defaultProjectRequest();
    private final CreateProjectRequest createProjectRequest = defaultCreateProjectRequest();
    private final UpdateProjectRequest updateProjectRequest = defaultUpdateProjectRequest();
    private final UserEntity user = createUser();
    @Autowired
    private ProjectMapper projectMapper;
    private ProjectResponse projectResponse;

    @Test
    void toResponse_ShouldMapToResponse_WhenValid() {
        projectResponse = projectMapper.toResponse(project);

        assertEquals(project.getId(), projectResponse.id());
        assertEquals(project.getName(), projectResponse.name());
        assertEquals(project.getDescription(), projectResponse.description());
    }

    @Test
    void toEntityWithCreateProjectRequest_ShouldMapToProject_WhenValid() {
        Project newProject = projectMapper.toEntity(createProjectRequest, user);

        assertEquals(user.getId(), newProject.getOwner().getId());
        assertEquals(project.getName(), newProject.getName());
        assertEquals(project.getDescription(), newProject.getDescription());
    }

    @Test
    void toEntityWithProjectRequest_ShouldMapToProject_WhenValid() {
        Project newProject = projectMapper.toEntity(projectRequest, user);

        assertEquals(user.getId(), newProject.getOwner().getId());
        assertEquals(project.getName(), newProject.getName());
        assertNull(newProject.getDescription());
    }

    @Test
    void updateEntity_ShouldUpdateEntity_WhenValid() {
        projectMapper.updateEntity(updateProjectRequest, project);

        assertEquals(NEW_PROJECT_NAME, project.getName());
    }
}