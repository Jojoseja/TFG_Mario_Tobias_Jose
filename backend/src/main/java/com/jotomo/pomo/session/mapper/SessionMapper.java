package com.jotomo.pomo.session.mapper;

import com.jotomo.pomo.session.dto.SessionRequest;
import com.jotomo.pomo.session.dto.SessionResponse;
import com.jotomo.pomo.session.model.Session;
import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import com.jotomo.pomo.task.models.Task;
import com.jotomo.pomo.user.model.UserEntity;
import org.mapstruct.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface SessionMapper {

    @Mapping(target = "sessionConfigurationId", source = "sessionConfiguration.id")
    @Mapping(target = "taskIds", source = "tasks")
    @Mapping(target = "pomodoros", source = "pomodoros")
    SessionResponse toResponse(Session session);

    @Mapping(target = "id", ignore = true)
    Session toEntity(SessionRequest request, UserEntity user, SessionConfiguration sessionConfiguration, List<Task> tasks);

    default List<UUID> mapTasksToIds(List<Task> tasks) {
        if (tasks == null) return new ArrayList<>();

        return tasks.stream().map(Task::getId).toList();
    }

    default Integer map(LocalTime value) {
        if (value == null) return null;
        return value.toSecondOfDay() / 60;
    }

    default LocalTime map(Integer value) {
        if (value == null) return null;
        return LocalTime.ofSecondOfDay(value * 60L);
    }
}
