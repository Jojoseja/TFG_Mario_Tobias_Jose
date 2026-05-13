CREATE TABLE password_reset_tokens
(
    id         UUID                        NOT NULL,
    token      VARCHAR(255)                NOT NULL,
    user_id    UUID                        NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    used_at    TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_password_reset_tokens PRIMARY KEY (id)
);

ALTER TABLE password_reset_tokens
    ADD CONSTRAINT uc_password_reset_tokens_token UNIQUE (token);

ALTER TABLE password_reset_tokens
    ADD CONSTRAINT FK_PASSWORD_RESET_TOKENS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);
