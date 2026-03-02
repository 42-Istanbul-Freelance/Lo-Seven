package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.AuthResponse;
import com.pearlconnect.backend.dto.LoginRequest;
import com.pearlconnect.backend.dto.RegisterRequest;
import com.pearlconnect.backend.entity.Role;
import com.pearlconnect.backend.entity.School;
import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.repository.SchoolRepository;
import com.pearlconnect.backend.repository.UserRepository;
import com.pearlconnect.backend.security.CustomUserDetails;
import com.pearlconnect.backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("[DEBUG LOGIN] Attempting login for: " + loginRequest.getEmail());
        System.out.println("[DEBUG LOGIN] Password length: "
                + (loginRequest.getPassword() != null ? loginRequest.getPassword().length() : "null"));

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(jwt, "Bearer",
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getUser().getFirstName(),
                    userDetails.getUser().getLastName(),
                    userDetails.getUser().getRole().name(),
                    userDetails.getUser().getProfilePictureUrl()));
        } catch (Exception e) {
            System.out.println("[DEBUG LOGIN] Auth failed: " + e.getMessage());
            // Check manually
            var userOpt = userRepository.findByEmail(loginRequest.getEmail());
            if (userOpt.isPresent()) {
                var user = userOpt.get();
                boolean matches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
                System.out.println(
                        "[DEBUG LOGIN] User found. Password hash: " + user.getPassword().substring(0, 10) + "...");
                System.out.println("[DEBUG LOGIN] Manual BCrypt match: " + matches);
            } else {
                System.out.println("[DEBUG LOGIN] User NOT found in DB");
            }
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName() != null ? registerRequest.getLastName() : "")
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .build();

        if (registerRequest.getRole() == Role.PRINCIPAL && registerRequest.getSchoolName() != null) {
            // PRINCIPAL is registering a new school
            School newSchool = School.builder()
                    .name(registerRequest.getSchoolName())
                    .address(registerRequest.getSchoolName()) // Use school name as address placeholder
                    .schoolType(registerRequest.getSchoolType() != null ? registerRequest.getSchoolType() : "LISE")
                    .build();
            newSchool = schoolRepository.save(newSchool);
            user.setSchool(newSchool);
        } else if (registerRequest.getSchoolId() != null) {
            School school = schoolRepository.findById(registerRequest.getSchoolId()).orElse(null);
            user.setSchool(school);
        } else {
            schoolRepository.findAll().stream().findFirst().ifPresent(user::setSchool);
        }

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/schools")
    public ResponseEntity<?> getSchools() {
        return ResponseEntity.ok(schoolRepository.findAll());
    }
}
