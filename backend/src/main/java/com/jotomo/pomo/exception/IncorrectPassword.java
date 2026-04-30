package com.jotomo.pomo.exception;

public class IncorrectPassword extends RuntimeException {
    public IncorrectPassword() {
        super("Credentials Do Not Match");
    }
}
