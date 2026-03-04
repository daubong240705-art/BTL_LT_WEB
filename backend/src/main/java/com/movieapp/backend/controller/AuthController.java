package com.movieapp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; 
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieapp.backend.domain.RestResponse;
import com.movieapp.backend.dto.auth.LoginDTO;
import com.movieapp.backend.dto.auth.ResLoginDTO;
import com.movieapp.backend.util.ResponseUtil;
import com.movieapp.backend.util.SecurityUtil;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    // TIÊM TRỰC TIẾP AUTHENTICATION MANAGER
    private final AuthenticationManager authenticationManager;
    private final SecurityUtil securityUtil;

    @PostMapping("/login")
    public ResponseEntity<RestResponse<ResLoginDTO>> login(@Valid @RequestBody LoginDTO login) {

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                login.getUsername(),
                login.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        String access_token = securityUtil.createToken(authentication);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO res = new ResLoginDTO();
        res.setAccessToken(access_token);
        return ResponseUtil.success(res, "Đăng nhập thành công!");
    }
}