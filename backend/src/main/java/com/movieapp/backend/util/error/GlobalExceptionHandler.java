package com.movieapp.backend.util.error;

import com.movieapp.backend.domain.RestResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler {

    // =============================
    // VALIDATION ERROR (400)
    // =============================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        // API trả ra sẽ có dạng: "error": { "username": "không được để trống", "email":
        // "sai định dạng" }
        return buildResponse(HttpStatus.BAD_REQUEST, errors);
    }

    // =============================
    // NOT FOUND (404)
    // =============================
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<RestResponse<Object>> handleNotFound(
            ResourceNotFoundException ex) {

        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // =============================
    // BAD REQUEST (400)
    // =============================
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<RestResponse<Object>> handleBadRequest(
            BadRequestException ex) {

        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // =============================
    // DUPLICATE UNIQUE (400)
    // =============================
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<RestResponse<Object>> handleDuplicate(
            DataIntegrityViolationException ex) {

        String message = "Duplicate data";

        Throwable root = ex.getRootCause();
        if (root != null && root.getMessage() != null) {

            String error = root.getMessage();

            if (error.contains("uk_user_username")) {
                message = "Username already exists";
            } else if (error.contains("uk_user_email")) {
                message = "Email already exists";
            } else if (error.contains("uk_movie_slug")) {
                message = "Movie slug already exists";
            }
        }

        return buildResponse(HttpStatus.BAD_REQUEST, message);
    }

    // =============================
    // FALLBACK (500)
    // =============================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestResponse<Object>> handleAll(Exception ex) {

        // Có thể log ở đây
        // log.error("Unexpected error", ex);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error");
    }

    // =============================
    // COMMON BUILDER
    // =============================
    private ResponseEntity<RestResponse<Object>> buildResponse(
            HttpStatus status,
            Object error) {

        RestResponse<Object> res = RestResponse.<Object>builder()
                .statusCode(status.value())
                .message(status.getReasonPhrase())
                .error(error)
                .build();

        return ResponseEntity.status(status).body(res);
    }
}