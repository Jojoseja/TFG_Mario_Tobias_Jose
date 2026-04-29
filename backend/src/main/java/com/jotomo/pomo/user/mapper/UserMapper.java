package com.jotomo.pomo.user.mapper;

import com.jotomo.pomo.auth.dto.LoginRequest;
import com.jotomo.pomo.user.dto.CreateUserRequest;
import com.jotomo.pomo.user.dto.UpdateUserMeRequest;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.model.UserEntity;
import org.mapstruct.*;

@Mapper(
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING
)
public interface UserMapper {

    UserResponse toResponse(UserEntity user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "sessionConfiguration", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "projects", ignore = true)
    UserEntity toEntity(CreateUserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "sessionConfiguration", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "projects", ignore = true)
    UserEntity toEntity(LoginRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateUserMeRequest request, @MappingTarget UserEntity user);
}