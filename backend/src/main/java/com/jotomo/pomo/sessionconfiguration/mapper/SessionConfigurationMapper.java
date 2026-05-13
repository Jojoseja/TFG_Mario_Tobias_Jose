package com.jotomo.pomo.sessionconfiguration.mapper;

import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationRequest;
import com.jotomo.pomo.sessionconfiguration.dto.SessionConfigurationResponse;
import com.jotomo.pomo.user.model.UserEntity;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface SessionConfigurationMapper {

    SessionConfigurationResponse toResponse(SessionConfiguration sessionConfiguration);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sessions", ignore = true)
    SessionConfiguration toEntity(SessionConfigurationRequest request, UserEntity user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "sessions", ignore = true)
    void updateEntity(SessionConfigurationRequest request, @MappingTarget SessionConfiguration entity);
}

