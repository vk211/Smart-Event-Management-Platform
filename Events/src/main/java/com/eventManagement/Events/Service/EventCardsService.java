package com.eventManagement.Events.Service;

//public class EventCardsService {
//}
//package com.eventManagement.Events.Service;

import com.eventManagement.Events.Entity.EventCards;
import com.eventManagement.Events.Repository.EventCardsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventCardsService {

    private final EventCardsRepository eventCardsRepository;

    public EventCardsService(EventCardsRepository eventCardsRepository) {
        this.eventCardsRepository = eventCardsRepository;
    }

    public List<EventCards> getAll() {
        return eventCardsRepository.findAll();
    }

    public EventCards save(EventCards event) {
        return eventCardsRepository.save(event);
    }
}
