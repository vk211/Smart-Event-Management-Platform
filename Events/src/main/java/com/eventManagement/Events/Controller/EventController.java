package com.eventManagement.Events.Controller;

import com.eventManagement.Events.Entity.Event;
import com.eventManagement.Events.Repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // Create event - ADMIN, ORGANISER
    @PostMapping("/create")
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // Get all events - ADMIN, ORGANISER, ATTENDEE
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get event by ID - ADMIN, ORGANISER, ATTENDEE
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // Update event - ADMIN, ORGANISER
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setName(updatedEvent.getName());
        event.setDescription(updatedEvent.getDescription());
        event.setCategory(updatedEvent.getCategory());
        event.setDate(updatedEvent.getDate());
        event.setLocation(updatedEvent.getLocation());
        event.setPrice(updatedEvent.getPrice());
//        event.setImageUrl(updatedEvent.getImageUrl());
        event.setOrganizer(updatedEvent.getOrganizer());
        return eventRepository.save(event);
    }

    // Delete event - ADMIN, ORGANISER
    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return "Event deleted";
    }
}
