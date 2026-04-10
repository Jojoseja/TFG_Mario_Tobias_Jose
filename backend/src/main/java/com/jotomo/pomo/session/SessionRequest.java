package com.jotomo.pomo.session;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record SessionRequest (
        UUID SessionConfigurationId,
        List<@NotNull UUID> taskIds
){
}
