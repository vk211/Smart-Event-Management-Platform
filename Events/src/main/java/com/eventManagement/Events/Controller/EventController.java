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

    // Create event - ADMIN, ORGANIZER
    @PostMapping("/create")
    public Event createEvent(@RequestBody Event event) {
        // Optional: if ticketTiers JSON exists, set default price
        if (event.getTicketTiers() != null && !event.getTicketTiers().isEmpty()) {
            try {
                // Example: parse JSON to get first tier price
                // Adjust parsing logic based on your frontend format
                // JSONArray tiers = new JSONArray(event.getTicketTiers());
                // event.setPrice(tiers.getJSONObject(0).getDouble("price"));
            } catch (Exception e) {
                // fallback
            }
        }
        return eventRepository.save(event);
    }

    // Get all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get event by ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // Update event
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setName(updatedEvent.getName());
        event.setDescription(updatedEvent.getDescription());
        event.setCategory(updatedEvent.getCategory());
        event.setStartDate(updatedEvent.getStartDate());
        event.setEndDate(updatedEvent.getEndDate());
        event.setLocation(updatedEvent.getLocation());
        event.setCapacity(updatedEvent.getCapacity());
        event.setTicketTiers(updatedEvent.getTicketTiers());
        event.setPrice(updatedEvent.getPrice());
        event.setImage(updatedEvent.getImage());
        event.setAgenda(updatedEvent.getAgenda());
        event.setOrganizer(updatedEvent.getOrganizer());

        return eventRepository.save(event);
    }

    // Delete event
    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return "Event deleted";
    }
}
