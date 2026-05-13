package com.jotomo.pomo.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("User wasn't found");
    }
}
