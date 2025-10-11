package com.eventManagement.Events.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = true)
    private LocalDate startDate;

    @Column(nullable = true)
    private LocalDate endDate;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String ticketTiers; // JSON string

    @Column(nullable = false)
    private double price;

    @Column(nullable = true)
    private String image; // banner URL

    @Column(nullable = true, length = 1000)
    private String agenda;

    @Column(nullable = false, length = 100)
    private String organizer;

    public Event() {}

    public Event(String name, String description, String category,
                 LocalDate startDate, LocalDate endDate, String location,
                 int capacity, String ticketTiers, double price,
                 String image, String agenda, String organizer) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.capacity = capacity;
        this.ticketTiers = ticketTiers;
        this.price = price;
        this.image = image;
        this.agenda = agenda;
        this.organizer = organizer;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getTicketTiers() { return ticketTiers; }
    public void setTicketTiers(String ticketTiers) { this.ticketTiers = ticketTiers; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
}
