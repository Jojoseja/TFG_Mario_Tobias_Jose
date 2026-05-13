package com.jotomo.pomo.user.controller;

import com.jotomo.pomo.constants.ApiConstants;
import com.jotomo.pomo.exception.UserNotFoundException;
import com.jotomo.pomo.logging.AuditLogger;
import com.jotomo.pomo.user.dto.CreateUserRequest;
import com.jotomo.pomo.user.dto.UpdateUserMeRequest;
import com.jotomo.pomo.user.dto.UserResponse;
import com.jotomo.pomo.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiConstants.USER_PATH)
@Slf4j
public class UserController {

    private final AuditLogger auditLogger;

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(request));
    }

    @GetMapping(ApiConstants.PATH_ID)
    public ResponseEntity<UserResponse> findUserById(@PathVariable UUID id){
        return ResponseEntity.ok(userService.findById(id).orElseThrow(UserNotFoundException::new));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> findUserByEmail(@PathVariable String email){
        return ResponseEntity.ok(userService.findByEmail(email).orElseThrow(UserNotFoundException::new));
    }

    @PatchMapping
    public ResponseEntity<UserResponse> updateUser(
            @RequestHeader(ApiConstants.USER_ID_HEADER) UUID userId,
            @Valid @RequestBody UpdateUserMeRequest request
    ){
        return ResponseEntity.ok(userService.update(userId, request));
    }

    @DeleteMapping(ApiConstants.PATH_ID)
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
