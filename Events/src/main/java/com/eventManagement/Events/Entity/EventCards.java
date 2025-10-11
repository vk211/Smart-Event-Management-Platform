package com.eventManagement.Events.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Table(name = "event_cards")
public class EventCards {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    private String category;

    private LocalDate date;

    private String location;
    private double price;
    private String image;
    private String organizer;
    private double rating;
    private int attendees;

    @ElementCollection
    private List<String> tags;

    public EventCards(Long id, String name, String description, String category, String date,
                      String location, double price, String image, String organizer,
                      double rating, int attendees, List<String> tags) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        // parse String to LocalDate (assumes "yyyy-MM-dd" format)
        this.date = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
        this.location = location;
        this.price = price;
        this.image = image;
        this.organizer = organizer;
        this.rating = rating;
        this.attendees = attendees;
        this.tags = tags;
    }

    public EventCards() {
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

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getAttendees() { return attendees; }
    public void setAttendees(int attendees) { this.attendees = attendees; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
