DROP DATABASE IF EXISTS vakantie_vila;
CREATE DATABASE vakantie_vila;
USE vakantie_vila;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    avatar_url TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    bedrooms INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    amenities TEXT,
    image_url TEXT NOT NULL,
    status ENUM('available', 'sold', 'pending') DEFAULT 'available',
    property_type ENUM('apartment', 'house', 'villa', 'cabin', 'tent', 'loft') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url TEXT NOT NULL,
    image_type ENUM('interior', 'exterior', 'surroundings') NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS hero_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add this at the end of your database.sql file to verify data
SELECT 'Verifying database setup...' as '';
SELECT COUNT(*) as property_count FROM properties;
SELECT COUNT(*) as image_count FROM property_images;
