package com.movieapp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; // Đổi import
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieapp.backend.domain.RestResponse;
import com.movieapp.backend.dto.auth.LoginDTO;
import com.movieapp.backend.util.ResponseUtil;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class AuthController {

    // TIÊM TRỰC TIẾP AUTHENTICATION MANAGER
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<RestResponse<LoginDTO>> login(@Valid @RequestBody LoginDTO login) {

        // 1. Tạo token chứa thông tin user gửi lên
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                login.getUsername(),
                login.getPassword());

        // 2. Gọi hàm authenticate (Nó sẽ tự động tìm đến UserDetailCustom của bạn để
        // check DB)
        // Nếu sai mật khẩu hoặc user không tồn tại, nó sẽ quăng Exception ở ngay dòng
        // này!
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // 3. Nếu chạy được đến đây nghĩa là ĐĂNG NHẬP THÀNH CÔNG
        return ResponseUtil.success(login, "Đăng nhập thành công!");
    }
}