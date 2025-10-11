package com.eventManagement.Events.Service;

import com.eventManagement.Events.Entity.User;
import com.eventManagement.Events.Repository.UserRepository;
import com.eventManagement.Events.Utills.Role;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       RedisTemplate<String, Object> redisTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.redisTemplate = redisTemplate;
    }

    // Get all users with caching
    public List<User> getAllUsers() {
        String key = "users:all";
        List<User> users = (List<User>) redisTemplate.opsForValue().get(key);
        if (users != null) {
            return users; // return from cache
        }
        users = userRepository.findAll();
        redisTemplate.opsForValue().set(key, users, 10, TimeUnit.MINUTES);
        return users;
    }

    // Get user by ID with caching
    public Optional<User> getUserById(Long id) {
        String key = "user:" + id;
        User cachedUser = (User) redisTemplate.opsForValue().get(key);
        if (cachedUser != null) {
            return Optional.of(cachedUser);
        }
        Optional<User> user = userRepository.findById(id);
        user.ifPresent(u -> redisTemplate.opsForValue().set(key, u, 10, TimeUnit.MINUTES));
        return user;
    }

    // Create user
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = user.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = new HashSet<>();
            roles.add(Role.ATTENDEE);
            user.setRoles(roles);
        }

        if (!roles.contains(Role.ORGANIZER)) {
            user.setOrganization(null);
        }

        User savedUser = userRepository.save(user);

        // Invalidate caches
        redisTemplate.delete("users:all");
        redisTemplate.opsForValue().set("user:" + savedUser.getId(), savedUser, 10, TimeUnit.MINUTES);

        return savedUser;
    }

    // Update user
    public User updateUser(Long id, User updatedUser) {
        User savedUser = userRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedUser.getName());
                    existing.setEmail(updatedUser.getEmail());
                    existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    existing.setPhone(updatedUser.getPhone());
                    existing.setOrganization(
                            updatedUser.getRoles().contains(Role.ORGANIZER) ? updatedUser.getOrganization() : null
                    );
                    existing.setProfilePic(updatedUser.getProfilePic());
                    existing.setRoles(updatedUser.getRoles() != null && !updatedUser.getRoles().isEmpty()
                            ? updatedUser.getRoles()
                            : Set.of(Role.ATTENDEE));
                    return userRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update caches
        redisTemplate.opsForValue().set("user:" + savedUser.getId(), savedUser, 10, TimeUnit.MINUTES);
        redisTemplate.delete("users:all");

        return savedUser;
    }

    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);

        // Clear caches
        redisTemplate.delete("user:" + id);
        redisTemplate.delete("users:all");
    }
}
