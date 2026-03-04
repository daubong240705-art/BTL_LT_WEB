package com.movieapp.backend.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.movieapp.backend.domain.RestResponse;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;
    

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    // ==========================================
    // 1. XỬ LÝ 401 UNAUTHORIZED (Chưa đăng nhập, sai hoặc hết hạn Token)
    // ==========================================
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException)
            throws IOException, ServletException {

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        // Có thể lấy thông báo lỗi chi tiết từ authException.getMessage() nếu muốn
        res.setError(authException.getMessage());
        res.setMessage("Token không hợp lệ, đã hết hạn hoặc bạn chưa đăng nhập.");

        // Biến Object thành JSON và trả về Frontend
        response.getWriter().write(objectMapper.writeValueAsString(res));
    }

    // ==========================================
    // 2. XỬ LÝ 403 FORBIDDEN (Có Token nhưng không đủ quyền - VD: User gọi API của
    // Admin)
    // ==========================================
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpStatus.FORBIDDEN.value());

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.FORBIDDEN.value());
        res.setError(accessDeniedException.getMessage());
        res.setMessage("Bạn không có quyền (Role) để truy cập vào tài nguyên này.");

        // Biến Object thành JSON và trả về Frontend
        response.getWriter().write(objectMapper.writeValueAsString(res));
    }
}