package fit.iuh.payment_service.entities;

public enum RefundStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    BOOKING_SYNC_PENDING,
    FAILED,
    CANCELLED
}
