package com.jotomo.pomo.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserMeRequest(

        @Size(min = 1, max = 50)
        String username,

        @Email
        @Size(max = 100)
        String email
){}
