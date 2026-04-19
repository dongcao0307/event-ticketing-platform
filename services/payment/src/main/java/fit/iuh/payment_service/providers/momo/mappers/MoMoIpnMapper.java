package fit.iuh.payment_service.providers.momo.mappers;

import fit.iuh.payment_service.providers.momo.dtos.internal.MoMoIpnSignaturePayload;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoIpnRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MoMoIpnMapper {
    @Mapping(target = "partnerCode", source = "request.partnerCode")
    @Mapping(target = "accessKey", source = "accessKey")
    @Mapping(target = "requestId", source = "request.requestId")
    @Mapping(target = "amount", source = "request.amount")
    @Mapping(target = "orderId", source = "request.orderId")
    @Mapping(target = "orderInfo", source = "request.orderInfo")
    @Mapping(target = "orderType", source = "request.orderType")
    @Mapping(target = "transId", source = "request.transId")
    @Mapping(target = "message", source = "request.message")
    @Mapping(target = "responseTime", source = "request.responseTime")
    @Mapping(target = "resultCode", expression = "java(String.valueOf(request.getResultCode()))")
    @Mapping(target = "payType", source = "request.payType")
    @Mapping(target = "extraData", source = "request.extraData")
    MoMoIpnSignaturePayload toSignaturePayload(MoMoIpnRequest request, String accessKey);

    default String toSignatureData(MoMoIpnSignaturePayload payload) {
        return "accessKey=" + nv(payload.getAccessKey())
                + "&amount=" + nv(payload.getAmount())
                + "&extraData=" + nv(payload.getExtraData())
                + "&message=" + nv(payload.getMessage())
                + "&orderId=" + nv(payload.getOrderId())
                + "&orderInfo=" + nv(payload.getOrderInfo())
                + "&orderType=" + nv(payload.getOrderType())
                + "&partnerCode=" + nv(payload.getPartnerCode())
                + "&payType=" + nv(payload.getPayType())
                + "&requestId=" + nv(payload.getRequestId())
                + "&responseTime=" + nv(payload.getResponseTime())
                + "&resultCode=" + nv(payload.getResultCode())
                + "&transId=" + nv(payload.getTransId());
    }

    private String nv(String value) {
        return value == null ? "" : value;
    }
}
