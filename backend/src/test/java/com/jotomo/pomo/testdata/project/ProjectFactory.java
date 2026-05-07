package com.jotomo.pomo.testdata.project;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.project.model.Project;

import static com.jotomo.pomo.testdata.TestSetUp.*;

public class ProjectFactory {
    public static Project defaultProject(){
        return Project.builder()
                .name(PROJECT_NAME)
                .description(PROJECT_DESCRIPTION)
                .build();
    }

    public static ProjectRequest defaultProjectRequest() {
        return new ProjectRequest(PROJECT_NAME);
    }

    public static CreateProjectRequest defaultCreateProjectRequest(){
        return new CreateProjectRequest(PROJECT_NAME, PROJECT_DESCRIPTION);
    }

    public static UpdateProjectRequest defaultUpdateProjectRequest(){
        return new UpdateProjectRequest(NEW_PROJECT_NAME, PROJECT_DESCRIPTION);
    }

    public static ProjectResponse defaultProjectResponse(){
        return new ProjectResponse(null, PROJECT_NAME, PROJECT_DESCRIPTION,null, null, null);
    }
}
