package com.jotomo.pomo.project;

import com.jotomo.pomo.project.dto.CreateProjectRequest;
import com.jotomo.pomo.project.dto.ProjectResponse;
import com.jotomo.pomo.project.dto.UpdateProjectRequest;
import com.jotomo.pomo.user.UserEntity;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProjectMapper {

    @Mapping(target = "ownerId", source = "owner.id")
    ProjectResponse toResponse(Project project);

    @Mapping(target = "owner", source = "user")
    Project toEntity(CreateProjectRequest request, UserEntity user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateProjectRequest request, @MappingTarget Project project);

}
