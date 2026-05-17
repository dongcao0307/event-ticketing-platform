-- Sandbox seed for MoMo payment method
-- Run this after the payment service has created tables.

INSERT INTO payment_methods (id, display_name, logo_url, is_available, processor_type)
VALUES ('MOMO_SANDBOX', 'MoMo Sandbox', 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png', 1, 'MoMoProcessor')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    logo_url = VALUES(logo_url),
    is_available = VALUES(is_available),
    processor_type = VALUES(processor_type);

INSERT INTO payment_method_config_params (payment_method_id, config_key, config_value)
VALUES
    ('MOMO_SANDBOX', 'mode', 'sandbox'),
    ('MOMO_SANDBOX', 'requestType', 'payWithATM'),
    ('MOMO_SANDBOX', 'lang', 'vi')
ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value);
