-- MySQL Schema for ASD Soccer Dream Fermana
-- Auto-generated from JPA Entity definitions
-- Execute this script to create the database schema

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS soccerdreamfermana;
USE soccerdreamfermana;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password LONGTEXT NOT NULL,
  ruolo VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (email),
  INDEX idx_users_email (email),
  INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  titolo VARCHAR(180) NOT NULL,
  tipo VARCHAR(40),
  descrizione VARCHAR(3000) NOT NULL,
  data_evento DATETIME NOT NULL,
  data_fine DATETIME,
  luogo VARCHAR(240) NOT NULL,
  max_partecipanti INT NOT NULL,
  unlimited_capacity BOOLEAN NOT NULL DEFAULT FALSE,
  volantino LONGTEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_events_data_evento (data_evento),
  INDEX idx_events_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_booking_user_event (user_id, event_id),
  INDEX idx_bookings_user_id (user_id),
  INDEX idx_bookings_event_id (event_id),
  INDEX idx_bookings_created_at (created_at),
  CONSTRAINT fk_bookings_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_events FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  role VARCHAR(180) NOT NULL,
  position VARCHAR(40),
  shirt_number INT UNIQUE,
  image_url LONGTEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_members_shirt_number (shirt_number),
  INDEX idx_members_name (name),
  INDEX idx_members_role (role),
  INDEX idx_members_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  importo DOUBLE NOT NULL,
  paypal_order_id VARCHAR(80),
  payer_id VARCHAR(80),
  capture_id VARCHAR(80),
  payment_status VARCHAR(40),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_donations_created_at (created_at),
  INDEX idx_donations_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  titolo VARCHAR(180),
  descrizione VARCHAR(3000),
  immagine LONGTEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_photos_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert seed data (optional admin user for development)
-- Password: admin123 (bcrypted: $2a$10$...)
-- Uncomment to use this seed data in development
/*
INSERT IGNORE INTO users (id, nome, email, password, ruolo, created_at) VALUES
(1, 'Admin User', 'admin@soccerdream.local', '$2a$10$YAV/TKE91MZ1q/EUVKUzZelD7u/A6GW4lEPWHOE0uZG1kzFJfMeG.', 'ADMIN', NOW());
*/
