package com.eventManagement.Events.Utills;

import com.eventManagement.Events.Entity.Event;
import com.eventManagement.Events.Entity.User;
import com.eventManagement.Events.Repository.EventRepository;
import com.eventManagement.Events.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Configuration
public class Events {

    @Bean
    CommandLineRunner initData(UserRepository userRepository,
                               EventRepository eventRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {

            // ✅ Seed sample users
            if (userRepository.count() == 0) {
                User admin = new User("Admin User", "admin@example.com", passwordEncoder.encode("admin123"));
                admin.setRoles(Set.of(Role.ADMIN));

                User organiser = new User("Event Organiser", "organiser@example.com", passwordEncoder.encode("organiser123"));
                organiser.setRoles(Set.of(Role.ORGANISER));

                User attendee = new User("Vijay Attendee", "vijay@example.com", passwordEncoder.encode("vijay123"));
                attendee.setRoles(Set.of(Role.ATTENDEE));

                userRepository.saveAll(List.of(admin, organiser, attendee));
                System.out.println("✅ Sample users inserted into database!");
            }

            // ✅ Seed sample events
            if (eventRepository.count() == 0) {
                List<Event> events = List.of(
                        new Event(
                                "Tech Conference 2025",
                                "Explore AI, Cloud, and Blockchain innovations.",
                                "Conference",
                                LocalDate.parse("2025-10-10"),
                                "San Francisco, CA",
                                150,
                                "https://source.unsplash.com/600x400/?conference",
                                "TechWorld Inc."
                        ),
                        new Event(
                                "Rock Concert",
                                "Live performance by top bands!",
                                "Concert",
                                LocalDate.parse("2025-11-05"),
                                "Los Angeles, CA",
                                75,
                                "https://source.unsplash.com/600x400/?concert",
                                "MusicLive"
                        )
                );

                eventRepository.saveAll(events);
                System.out.println("✅ Sample events inserted into database!");
            }
        };
    }
}
