package com.jotomo.pomo.pomodoro.controller;

import com.jotomo.pomo.pomodoro.dto.CreatePomodoroRequest;
import com.jotomo.pomo.pomodoro.dto.PomodoroRequest;
import com.jotomo.pomo.pomodoro.dto.PomodoroResponse;
import com.jotomo.pomo.pomodoro.dto.UpdatePomodoroRequest;
import com.jotomo.pomo.pomodoro.service.PomodoroService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.UUID;

import static com.jotomo.pomo.constants.ApiConstants.PATH_ID;
import static com.jotomo.pomo.constants.ApiConstants.POMODORO_PATH;

@RestController
@RequestMapping(POMODORO_PATH)
@RequiredArgsConstructor
@Slf4j
public class PomodoroController {

    private final PomodoroService pomodoroService;

    @GetMapping(PATH_ID)
    public ResponseEntity<PomodoroResponse> getById(@PathVariable UUID id){
        return ResponseEntity.ok(pomodoroService.getById(id).orElseThrow(NoSuchElementException::new));
    }

    @GetMapping("/get")
    public ResponseEntity<PomodoroResponse> getBySessionIdAndOrderIndex(
            @RequestBody PomodoroRequest pomodoroRequest
    ){
        return ResponseEntity.ok(pomodoroService.getBySessionIdAndOrderIndex(pomodoroRequest.sessionId(),
                pomodoroRequest.orderIndex()).orElseThrow(NoSuchElementException::new));
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<PomodoroResponse> createPomodoro(@RequestBody CreatePomodoroRequest request){
        return ResponseEntity.ok(pomodoroService.createPomodoro(request));
    }

    @PatchMapping(PATH_ID)
    public ResponseEntity<PomodoroResponse> updatePomodoro(
            @RequestBody UpdatePomodoroRequest request,
            @PathVariable UUID id){
        return ResponseEntity.ok(pomodoroService.updatePomodoro(id, request));
    }

    @DeleteMapping(PATH_ID)
    public ResponseEntity<Void> deletePomodoro(
            @PathVariable UUID id
    ) {
        pomodoroService.deletePomodoro(id);
        return ResponseEntity.noContent().build();
    }
}
