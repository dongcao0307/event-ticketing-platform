package fit.iuh.ai_service.services;

import fit.iuh.ai_service.dtos.NerResponse;

public interface NerService {
    NerResponse extractEntities(String text);
}
