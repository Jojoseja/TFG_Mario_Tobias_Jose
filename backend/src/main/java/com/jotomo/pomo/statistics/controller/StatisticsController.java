package com.jotomo.pomo.statistics.controller;

import com.jotomo.pomo.statistics.dto.StatisticsResponse;
import com.jotomo.pomo.statistics.service.impl.StatisticsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static com.jotomo.pomo.constants.ApiConstants.STATISTICS_PATH;
import static com.jotomo.pomo.constants.ApiConstants.USER_ID_HEADER;

@RestController
@RequestMapping(STATISTICS_PATH)
@RequiredArgsConstructor
@Slf4j
public class StatisticsController {

    private final StatisticsServiceImpl statisticsService;

    @GetMapping
    public ResponseEntity<StatisticsResponse> getStatistics(
            @RequestHeader(USER_ID_HEADER) UUID id
    ) {
        return ResponseEntity.ok(statisticsService.getStatistics(id));
    }
}
