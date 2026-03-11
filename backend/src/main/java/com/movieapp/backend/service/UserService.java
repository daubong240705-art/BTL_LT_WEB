package com.movieapp.backend.service;

import com.movieapp.backend.domain.User;
import com.movieapp.backend.domain.enums.Role;
import com.movieapp.backend.dto.Meta;
import com.movieapp.backend.dto.ResultPaginationDTO;
import com.movieapp.backend.dto.User.UserDTO;
import com.movieapp.backend.dto.User.UserRequest;
import com.movieapp.backend.dto.auth.UpdateProfileDTO;
import com.movieapp.backend.dto.auth.SignupDTO;
import com.movieapp.backend.repository.UserRepository;
import com.movieapp.backend.service.mapper.UserMapper;
import com.movieapp.backend.util.error.CustomValidationException;
import com.movieapp.backend.util.error.ResourceNotFoundException;

import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public ResultPaginationDTO getAllUsers(Specification<User> spec, Pageable pageable) {

        Page<User> pageUser = userRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageUser.map(userMapper::toDTO).getContent());

        return rs;
    }

    public UserDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + id));

        return userMapper.toDTO(user);
    }

    public UserDTO createUser(UserRequest request) {
        // CHECK USERNAME

        Map<String, String> errors = new HashMap<>();

        if (userRepository.existsByUsername(request.getUsername())) {
            errors.put("username", "Tên đăng nhập đã tồn tại");
        }

        // 2. Kiểm tra Email
        if (userRepository.existsByEmail(request.getEmail())) {
            errors.put("email", "Email đã được sử dụng");
        }

        if (!errors.isEmpty()) {
            throw new CustomValidationException(errors);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setPassword(request.getPassword());
        user.setRole(Role.valueOf(request.getRole()));

        User saveUser = userRepository.save(user);
        return userMapper.toDTO(saveUser);
    }

    public UserDTO updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng vá»›i id: " + id));

        if (request.getEmail() != null
                && !request.getEmail().equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new CustomValidationException(Map.of("email", "Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng"));
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));

        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng!"));
        userRepository.delete(user);
    }

    public User hadGetUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserDTO updateCurrentUserProfile(String username, UpdateProfileDTO request) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("Khong tim thay nguoi dung dang nhap");
        }

        user.setFullName(request.getFullName().trim());
        user.setAvatarUrl(request.getAvatarUrl().trim());

        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    public void updateUserToken(String token, String username) {
        User currentUser = hadGetUserByUsername(username);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndUsername(String token, String username) {
        return this.userRepository.findByRefreshTokenAndUsername(token, username);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public SignupDTO createUser(SignupDTO signup) {

        Map<String, String> errors = new HashMap<>();

        if (userRepository.existsByUsername(signup.getUsername())) {
            errors.put("username", "Tên đăng nhập đã tồn tại");
        }

        if (userRepository.existsByEmail(signup.getEmail())) {
            errors.put("email", "Email đã được sử dụng");
        }

        if (!errors.isEmpty()) {
            throw new CustomValidationException(errors);
        }

        User user = new User();
        user.setUsername(signup.getUsername());
        user.setEmail(signup.getEmail());
        user.setFullName(signup.getFullName());

        user.setPassword(passwordEncoder.encode(signup.getPassword()));

        // mặc định role USER
        user.setRole(Role.USER);
        User saveUser = userRepository.save(user);

        return userMapper.toSignupDTO(saveUser);
    }
}
