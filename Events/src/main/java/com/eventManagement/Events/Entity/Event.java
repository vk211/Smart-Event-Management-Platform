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

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false, length = 100)
    private String organizer;

    // ✅ Future-ready relationship (optional for now)
    // Uncomment if you want to link an event to a specific User (organizer)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "organizer_id")
    // private User organizerUser;

    // --- Constructors ---
    public Event() {}

    public Event(String name, String description, String category,
                 LocalDate date, String location, double price,
                 String image, String organizer) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.date = date;
        this.location = location;
        this.price = price;
        this.image = image;
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

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
}
