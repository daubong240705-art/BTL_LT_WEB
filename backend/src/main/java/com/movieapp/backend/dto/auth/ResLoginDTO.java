package com.movieapp.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
    private String accessToken;
    private UserLogin user;

    @Getter
    @Setter
    public class UserLogin {
        private Long id;

        private String username;

        private String email;

        private String fullName;

        private String avatarUrl;

        private String role;
    }

}
