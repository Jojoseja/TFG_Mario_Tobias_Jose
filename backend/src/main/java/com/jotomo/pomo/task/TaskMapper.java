package com.jotomo.pomo.task;

import com.jotomo.pomo.project.Project;

import com.jotomo.pomo.task.dto.CreateTaskRequest;
import com.jotomo.pomo.task.dto.TaskResponse;
import com.jotomo.pomo.task.dto.UpdateTaskRequest;
import com.jotomo.pomo.user.UserEntity;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface TaskMapper {

    @Mapping(target = "ownerId", source = "owner.id")
    TaskResponse toResponse(Task task);

    @Mapping(target = "owner", source = "user")
    Task toEntity(CreateTaskRequest request, UserEntity user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateTaskRequest request, @MappingTarget Task task);
}
