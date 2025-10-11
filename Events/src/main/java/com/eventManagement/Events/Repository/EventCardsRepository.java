package com.eventManagement.Events.Repository;
//
//public class EventCardsRepository {
//}
//package com.eventManagement.Events.Repository;

import com.eventManagement.Events.Entity.EventCards;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventCardsRepository extends JpaRepository<EventCards, Long> {
}
