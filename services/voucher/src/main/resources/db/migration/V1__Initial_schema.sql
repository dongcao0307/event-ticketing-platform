-- ═════════════════════════════════════════════════════════
-- V1: Initial Schema - Create Vouchers Table
-- ═════════════════════════════════════════════════════════
CREATE TABLE vouchers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    discount_type VARCHAR(50) NOT NULL COMMENT 'FIXED_AMOUNT or PERCENTAGE',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    organizer_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    version INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_organizer_id (organizer_id),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date),
    INDEX idx_is_active (is_active)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;