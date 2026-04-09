-- ═════════════════════════════════════════════════════════
-- V2: Insert Sample Data
-- ═════════════════════════════════════════════════════════
INSERT INTO vouchers (
        code,
        campaign_name,
        discount_value,
        discount_type,
        start_date,
        end_date,
        organizer_id,
        is_active,
        version
    )
VALUES (
        'SUMMER2024',
        'Summer Sale Campaign',
        50000.00,
        'FIXED_AMOUNT',
        '2024-06-01 00:00:00',
        '2024-08-31 23:59:59',
        1,
        true,
        0
    ),
    (
        'SALE20',
        'Special 20% Discount',
        20.00,
        'PERCENTAGE',
        '2024-06-15 00:00:00',
        '2024-07-15 23:59:59',
        1,
        true,
        0
    ),
    (
        'WELCOME100',
        'Welcome New Users',
        100000.00,
        'FIXED_AMOUNT',
        '2024-01-01 00:00:00',
        '2024-12-31 23:59:59',
        2,
        true,
        0
    ),
    (
        'FLASH50',
        'Flash Sale 50%',
        50.00,
        'PERCENTAGE',
        '2024-07-01 00:00:00',
        '2024-07-07 23:59:59',
        2,
        true,
        0
    ),
    (
        'HOLIDAY30',
        'Holiday Special',
        30.00,
        'PERCENTAGE',
        '2024-12-01 00:00:00',
        '2024-12-31 23:59:59',
        3,
        true,
        0
    ),
    (
        'VIPEXCLUSIVE',
        'VIP Exclusive Deal',
        250000.00,
        'FIXED_AMOUNT',
        '2024-06-01 00:00:00',
        '2024-12-31 23:59:59',
        1,
        true,
        0
    ),
    (
        'EXPIRED',
        'Expired Voucher',
        10000.00,
        'FIXED_AMOUNT',
        '2023-01-01 00:00:00',
        '2023-12-31 23:59:59',
        2,
        false,
        0
    ),
    (
        'STUDENT15',
        'Student Discount 15%',
        15.00,
        'PERCENTAGE',
        '2024-05-01 00:00:00',
        '2024-12-31 23:59:59',
        3,
        true,
        0
    );