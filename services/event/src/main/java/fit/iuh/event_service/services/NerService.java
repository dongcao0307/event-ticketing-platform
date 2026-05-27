package fit.iuh.event_service.services;

import fit.iuh.event_service.dtos.NerResponse;

public interface NerService {
    NerResponse extractEntities(String text);
}
