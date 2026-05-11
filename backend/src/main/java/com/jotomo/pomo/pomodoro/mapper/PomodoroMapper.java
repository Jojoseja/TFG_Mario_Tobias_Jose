package com.jotomo.pomo.pomodoro.mapper;

import com.jotomo.pomo.pomodoro.dto.CreatePomodoroRequest;
import com.jotomo.pomo.pomodoro.dto.PomodoroRequest;
import com.jotomo.pomo.pomodoro.dto.PomodoroResponse;
import com.jotomo.pomo.pomodoro.dto.UpdatePomodoroRequest;
import com.jotomo.pomo.pomodoro.model.Pomodoro;
import com.jotomo.pomo.session.model.Session;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface PomodoroMapper {

    @Mapping(target = "sessionId", source = "session.id")
    PomodoroResponse toResponse(Pomodoro pomodoro);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "session", source = "session")
    Pomodoro toEntity(PomodoroRequest pomodoroRequest, Session session);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "session", source = "session")
    Pomodoro toEntity(CreatePomodoroRequest createPomodoroRequest, Session session);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdatePomodoroRequest updatePomodoroRequest, @MappingTarget Pomodoro pomodoro);
}
