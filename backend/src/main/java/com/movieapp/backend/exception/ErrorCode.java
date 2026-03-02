package com.movieapp.backend.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error"),
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "Invalid request"),

    MOVIE_NOT_FOUND(HttpStatus.NOT_FOUND, "Movie not found"),
    MOVIE_ALREADY_EXISTS(HttpStatus.CONFLICT, "Movie already exists"),
    MOVIE_SLUG_ALREADY_EXISTS(HttpStatus.CONFLICT, "Movie slug already exists"),
    INVALID_ENUM_VALUE(HttpStatus.BAD_REQUEST, "Invalid enum value"),

    EPISODE_NOT_FOUND(HttpStatus.NOT_FOUND, "Episode not found"),
    EPISODE_ORDER_DUPLICATE(HttpStatus.CONFLICT, "Episode order already exists"),

    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "Category not found"),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email already exists"),
    USERNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "Username already exists"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Email or password incorrect"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Access denied");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}