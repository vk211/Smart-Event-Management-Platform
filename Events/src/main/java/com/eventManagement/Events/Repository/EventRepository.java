//package com.eventManagement.Events.Repository;
//
//public class EventRepository {
//}
package com.eventManagement.Events.Repository;

import com.eventManagement.Events.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
