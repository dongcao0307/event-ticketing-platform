-- Sandbox seed for VNPay payment method
-- Run this after the payment service has created tables.

INSERT INTO payment_methods (id, display_name, logo_url, is_available, processor_type)
VALUES ('VNPAY_SANDBOX', 'VNPay Sandbox', 'https://sandbox.vnpayment.vn/favicon.ico', 1, 'VNPayProcessor')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    logo_url = VALUES(logo_url),
    is_available = VALUES(is_available),
    processor_type = VALUES(processor_type);

INSERT INTO payment_method_config_params (payment_method_id, config_key, config_value)
VALUES
    ('VNPAY_SANDBOX', 'mode', 'sandbox'),
    ('VNPAY_SANDBOX', 'locale', 'vn'),
    ('VNPAY_SANDBOX', 'currCode', 'VND'),
    ('VNPAY_SANDBOX', 'orderType', 'other')
ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value);
