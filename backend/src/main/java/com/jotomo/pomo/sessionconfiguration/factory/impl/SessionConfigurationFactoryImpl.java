package com.jotomo.pomo.sessionconfiguration.factory.impl;

import com.jotomo.pomo.sessionconfiguration.factory.SessionConfigurationFactory;
import com.jotomo.pomo.sessionconfiguration.model.SessionConfiguration;
import org.springframework.stereotype.Component;

@Component
public class SessionConfigurationFactoryImpl implements SessionConfigurationFactory {

    public SessionConfiguration defaultConfiguration() {
        return SessionConfiguration.builder().
                workDuration(1500).
                shortBreakDuration(300).
                longBreakDuration(900).
                cyclesBeforeLongBreak(3).
                build();
    }
}
