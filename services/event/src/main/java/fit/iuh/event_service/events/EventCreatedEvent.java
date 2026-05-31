package fit.iuh.event_service.events;

import fit.iuh.event_service.models.Event;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class EventCreatedEvent {
    private final Event event;
}
