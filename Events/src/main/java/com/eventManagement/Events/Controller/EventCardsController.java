//package com.eventManagement.Events.Controller;
//
//public class EventCardsController {
//}
package com.eventManagement.Events.Controller;

import com.eventManagement.Events.Entity.EventCards;
import com.eventManagement.Events.Service.EventCardsService;
import org.springframework.web.bind.annotation.*;
        import java.util.List;

@RestController
@RequestMapping("/api/eventcards")
@CrossOrigin(origins = "http://localhost:3000")
public class EventCardsController {

    private final EventCardsService eventCardsService;

    public EventCardsController(EventCardsService eventCardsService) {
        this.eventCardsService = eventCardsService;
    }

    @GetMapping
    public List<EventCards> getAll() {
        return eventCardsService.getAll();
    }

    @PostMapping
    public EventCards create(@RequestBody EventCards eventCard) {
        return eventCardsService.save(eventCard);
    }
}
