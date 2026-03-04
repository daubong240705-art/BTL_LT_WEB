package com.movieapp.backend.service.error;

import com.movieapp.backend.domain.RestResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =============================
    // VALIDATION ERROR (400)
    // =============================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        BindingResult result = ex.getBindingResult();

        List<String> errors = result.getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField() + " " + fieldError.getDefaultMessage())
                .collect(Collectors.toList());

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                errors.size() == 1 ? errors.get(0) : errors);
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
        res.setStatusCode(status.value());
        res.setMessage(status.getReasonPhrase());
        res.setError(error);

        return ResponseEntity.status(status).body(res);
    }
}