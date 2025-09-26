package com.eventManagement.Events.Controller;

//public class AuthController {
//}
//package com.example.events.controller;

import com.eventManagement.Events.Entity.User;
import com.eventManagement.Events.Repository.UserRepository;
import com.eventManagement.Events.Utills.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String rawPassword = body.get("password");

        if (userRepository.existsByEmail(email)) return ResponseEntity.badRequest().body("Email exists");

        String hashed = passwordEncoder.encode(rawPassword);
        User user = new User(name, email, hashed);
        userRepository.save(user);
        return ResponseEntity.ok("Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        // Authenticate using AuthenticationManager (will use CustomUserDetailsService + PasswordEncoder)
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        // If no exception, successful authentication
        final String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
