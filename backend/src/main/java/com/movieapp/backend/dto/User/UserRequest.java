package com.movieapp.backend.dto.User;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String email;
    private String fullName;
    private String password;
    private String avatarUrl;
    private String role;
}
