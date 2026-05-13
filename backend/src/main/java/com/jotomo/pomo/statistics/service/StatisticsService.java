package com.jotomo.pomo.statistics.service;

import com.jotomo.pomo.statistics.dto.StatisticsResponse;

import java.util.UUID;

public interface StatisticsService {

    StatisticsResponse getStatistics(UUID userId);
}
