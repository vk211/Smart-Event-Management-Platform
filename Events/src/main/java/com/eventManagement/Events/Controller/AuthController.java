package com.eventManagement.Events.Controller;

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
@CrossOrigin(origins = "http://localhost:5173")
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

        if (userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body("Email already exists");

        String hashed = passwordEncoder.encode(rawPassword);
        User user = new User(name, email, hashed);
        userRepository.save(user);

        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        // Authenticate user
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        // Fetch the user entity
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Use getPrimaryRole() to get a single role
        String role = user.getPrimaryRole().name();

        // ✅ Include role inside the token
        final String token = jwtUtil.generateToken(email, role);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", role
        ));
    }
}
