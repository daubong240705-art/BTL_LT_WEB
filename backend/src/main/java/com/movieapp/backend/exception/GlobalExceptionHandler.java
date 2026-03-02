package com.movieapp.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {


        @ExceptionHandler(AppException.class)
        public ResponseEntity<ErrorResponse> handleAppException(
                        AppException ex,
                        HttpServletRequest request) {

                ErrorCode code = ex.getErrorCode();

                ErrorResponse response = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(code.getStatus().value())
                                .errorCode(code.name())
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(response, code.getStatus());
        }

  
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<?> handleValidationException(
                        MethodArgumentNotValidException ex) {

                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

                return ResponseEntity.badRequest().body(errors);
        }

  
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleUnknownException(
                        Exception ex,
                        HttpServletRequest request) {

                ErrorResponse response = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(500)
                                .errorCode(ErrorCode.INTERNAL_SERVER_ERROR.name())
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();

                return ResponseEntity.internalServerError().body(response);
        }
}