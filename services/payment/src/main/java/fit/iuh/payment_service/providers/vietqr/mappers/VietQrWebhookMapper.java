package fit.iuh.payment_service.providers.vietqr.mappers;

import fit.iuh.payment_service.providers.vietqr.dtos.internal.VietQrWebhookSignaturePayload;
import fit.iuh.payment_service.providers.vietqr.dtos.requests.VietQrWebhookRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VietQrWebhookMapper {
    @Mapping(target = "paymentId", source = "paymentId")
    @Mapping(target = "paymentToken", source = "paymentToken")
    @Mapping(target = "providerTransactionId", source = "providerTransactionId")
    @Mapping(target = "status", source = "status")
    VietQrWebhookSignaturePayload toSignaturePayload(VietQrWebhookRequest request);

    default String toSignatureData(VietQrWebhookSignaturePayload payload) {
        return payload.getPaymentId() + "|"
                + payload.getPaymentToken() + "|"
                + payload.getProviderTransactionId() + "|"
                + payload.getStatus();
    }
}
