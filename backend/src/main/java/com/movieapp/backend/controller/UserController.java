package com.movieapp.backend.controller;

import com.movieapp.backend.dto.User.UserDTO;
import com.movieapp.backend.dto.User.UserRequest;
import com.movieapp.backend.service.UserService;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    // API: danh sách người dùng
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // API: Theem ngoui dung
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserRequest request) {
        String hashPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(hashPassword);
        UserDTO createUser = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createUser);
    }

    // API: Cập nhật người dùng
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updatedUser(@PathVariable("id") Long id, @RequestBody UserRequest request) {

        UserDTO updateUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updateUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("da xoa");
    }
}