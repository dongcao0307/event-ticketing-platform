package fit.iuh.payment_service.providers.vnpay.mappers;

import fit.iuh.payment_service.providers.vnpay.dtos.internal.VnPayIpnSignaturePayload;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayIpnRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VnPayIpnMapper {
    @Mapping(target = "txnRef", source = "txnRef")
    @Mapping(target = "transactionNo", source = "transactionNo")
    @Mapping(target = "responseCode", source = "responseCode")
    @Mapping(target = "amount", source = "amount")
    VnPayIpnSignaturePayload toSignaturePayload(VnPayIpnRequest request);

    default String toSignatureData(VnPayIpnSignaturePayload payload) {
        return "vnp_TxnRef=" + payload.getTxnRef()
                + "&vnp_TransactionNo=" + payload.getTransactionNo()
                + "&vnp_ResponseCode=" + payload.getResponseCode()
                + "&vnp_Amount=" + payload.getAmount();
    }
}
