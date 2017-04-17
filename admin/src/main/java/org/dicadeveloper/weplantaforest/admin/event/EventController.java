package org.dicadeveloper.weplantaforest.admin.event;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.admin.code.Code;
import org.dicadeveloper.weplantaforest.admin.code.CodeRepository;
import org.dicadeveloper.weplantaforest.admin.errorhandling.IpatException;
import org.dicadeveloper.weplantaforest.admin.views.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(onConstructor = @__(@Autowired) )
@RestController
public class EventController {

    protected final Log LOG = LogFactory.getLog(EventController.class.getName());

    public final static String REQUEST_URL = "/event";

    private @NonNull EventService eventService;

    private @NonNull EventRepository eventRepository;

    private @NonNull CodeRepository _codeRepository;

    @PostMapping(value = REQUEST_URL)
    @JsonView(Views.EventDetails.class)
    public Event createEvent(@RequestBody Event event) throws IpatException {
        return eventService.create(event);
    }
    
    @PutMapping(value = REQUEST_URL)
    @JsonView(Views.EventDetails.class)
    public Event updateEvent(@RequestBody Event event) throws IpatException {
        return eventService.update(event);
    }

    @GetMapping(value = REQUEST_URL + "s")
    @JsonView(Views.EventOverview.class)
    public Iterable<Event> getEvents() {
        return eventRepository.findAll();
    }

    @GetMapping(value = REQUEST_URL + "/{eventId}")
    @JsonView(Views.EventDetails.class)
    public Event getEvent(@PathVariable Long eventId) throws IpatException {
        return eventService.getEvent(eventId);
    }

    @DeleteMapping(value = REQUEST_URL + "/{eventId}")
    public void deleteEvent(@PathVariable Long eventId) throws IpatException {
        eventService.delete(eventId);
    }

    @GetMapping(value = REQUEST_URL + "/codes/{eventId}")
    @JsonView(Views.CodeOverview.class)
    public Iterable<Code> getCodesForEvent(@PathVariable Long eventId) {
        return _codeRepository.findByEventId(eventId);
    }
}
