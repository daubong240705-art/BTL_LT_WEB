package com.movieapp.backend.controller.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieapp.backend.domain.User;
import com.movieapp.backend.dto.auth.LoginDTO;
import com.movieapp.backend.dto.auth.ResLoginDTO;
import com.movieapp.backend.dto.auth.SignupDTO;
import com.movieapp.backend.service.UserService;
import com.movieapp.backend.util.SecurityUtil;
import com.movieapp.backend.util.annotation.ApiMessage;
import com.movieapp.backend.util.error.BadRequestException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final SecurityUtil securityUtil;
        private final UserService userService;
        @Value("${movieapp.jwt.refresh-token}")
        private long refreshTokenExpiration;

        // API: Dăng nhập
        @PostMapping("/login")
        @ApiMessage("Đăng nhập thành công")
        public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO login) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                login.getUsername(),
                                login.getPassword());

                Authentication authentication = authenticationManager.authenticate(authenticationToken);

                ResLoginDTO res = new ResLoginDTO();

                User currentUser = userService.hadGetUserByUsername(login.getUsername());
                if (currentUser != null) {
                        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(currentUser.getId(),
                                        currentUser.getUsername(),
                                        currentUser.getEmail(), currentUser.getFullName(), currentUser.getAvatarUrl(),
                                        currentUser.getRole().name());
                        res.setUser(userLogin);
                }
                String access_token = securityUtil.createAccessToken(authentication.getName(), res);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                res.setAccessToken(access_token);

                String refresh_token = this.securityUtil.createRefreshToken(login.getUsername(), res);
                userService.updateUserToken(refresh_token, login.getUsername());

                ResponseCookie cookie = ResponseCookie.from("refresh_token", refresh_token)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(refreshTokenExpiration)
                                .sameSite("Strict")
                                .build();

                return ResponseEntity
                                .ok()
                                .header("Set-Cookie", cookie.toString())
                                .body(res);
        }

        // API: láy thông tin tài khoản đăng nhập
        @GetMapping("/account")
        @ApiMessage("Lấy thông tin tài khoản")
        public ResLoginDTO.UserLogin getAccount() {

                String username = SecurityUtil.getCurrentUserLogin();
                User user = userService.hadGetUserByUsername(username);

                return new ResLoginDTO.UserLogin(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getFullName(),
                                user.getAvatarUrl(),
                                user.getRole().name());
        }

        // API: Tạo refresh token mới
        @GetMapping("/refresh")
        @ApiMessage("Refresh Token thành công")
        public ResponseEntity<ResLoginDTO> getRefreshToken(
                        @CookieValue(name = "refresh_token") String refresh_token) {
                Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
                String username = decodedToken.getSubject();

                User currentUser = userService.getUserByRefreshTokenAndUsername(refresh_token, username);
                if (currentUser == null) {
                        throw new BadRequestException("Refresh Token không hợp lệ");
                }
                ResLoginDTO res = new ResLoginDTO();
                User currentUserDB = userService.hadGetUserByUsername(username);
                if (currentUserDB != null) {
                        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(currentUserDB.getId(),
                                        currentUserDB.getUsername(),
                                        currentUserDB.getEmail(), currentUserDB.getFullName(),
                                        currentUserDB.getAvatarUrl(),
                                        currentUserDB.getRole().name());
                        res.setUser(userLogin);
                }
                String access_token = securityUtil.createAccessToken(username, res);
                res.setAccessToken(access_token);

                String new_refresh_token = this.securityUtil.createRefreshToken(username, res);
                userService.updateUserToken(new_refresh_token, username);

                ResponseCookie cookie = ResponseCookie.from("refresh_token", new_refresh_token)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(refreshTokenExpiration)
                                .sameSite("Strict")
                                .build();

                return ResponseEntity
                                .ok()
                                .header("Set-Cookie", cookie.toString())
                                .body(res);
        }

        // API: Dăng xuất
        @PostMapping("/logout")
        @ApiMessage("Đăng xuất thành công")
        public ResponseEntity<Void> logout() {

                String username = SecurityUtil.getCurrentUserLogin();

                userService.updateUserToken(null, username);

                ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                                .httpOnly(true)
                                .path("/")
                                .maxAge(0)
                                .build();

                return ResponseEntity.ok()
                                .header("Set-Cookie", cookie.toString())
                                .build();
        }

        // API: Dăng ký
        @PostMapping("/signup")
        @ApiMessage("Đăng ký thành công")
        public SignupDTO signup(@Valid @RequestBody SignupDTO signup) {
                return userService.createUser(signup);
        }

}
