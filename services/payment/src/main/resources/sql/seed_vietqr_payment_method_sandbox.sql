-- Sandbox seed for VietQR payment method
-- Run this after the payment service has created tables.

INSERT INTO payment_methods (id, display_name, logo_url, is_available, processor_type)
VALUES ('VIETQR_SANDBOX', 'VietQR Sandbox', 'https://img.vietqr.io/image/logo.png', 1, 'VietQRProcessor')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    logo_url = VALUES(logo_url),
    is_available = VALUES(is_available),
    processor_type = VALUES(processor_type);

INSERT INTO payment_method_config_params (payment_method_id, config_key, config_value)
VALUES
    ('VIETQR_SANDBOX', 'bankBin', '970422'),
    ('VIETQR_SANDBOX', 'accountNo', '19036886660018'),
    ('VIETQR_SANDBOX', 'accountName', 'TICKET BOX SANDBOX'),
    ('VIETQR_SANDBOX', 'descriptionTemplate', 'PAY{paymentId}'),
    ('VIETQR_SANDBOX', 'mode', 'sandbox'),
    ('VIETQR_SANDBOX', 'webhookEnabled', 'true')
ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value);
