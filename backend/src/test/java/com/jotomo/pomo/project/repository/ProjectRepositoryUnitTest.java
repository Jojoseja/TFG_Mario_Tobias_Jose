package com.jotomo.pomo.project.repository;

import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.user.model.UserEntity;
import com.jotomo.pomo.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

import static com.jotomo.pomo.testdata.TestSetUp.PROJECT_NAME;
import static com.jotomo.pomo.testdata.user.UserFactory.createUser;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class ProjectRepositoryUnitTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private Project project;

    private List<Project> projectList = new ArrayList<>();

    private UserEntity userEntity;

    @BeforeEach
    void setUp() {
        userEntity = createUser();
        userRepository.save(userEntity);
    }

    @Test
    void findByOwner_ReturnList_WhenMatching() {
        createProject();
        projectList.add(project);
        assertEquals(projectList, projectRepository.findByOwner(userEntity));
    }

    @Test
    void findByOwnerAndName_ReturnProject_WhenMatching() {
        createProject();
        assertEquals(project, projectRepository.findByOwnerAndName(userEntity, PROJECT_NAME).get());
    }

    void createProject() {
        project = Project.builder()
                .name(PROJECT_NAME)
                .owner(userEntity)
                .build();
        projectRepository.save(project);
    }
}