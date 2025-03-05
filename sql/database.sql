-- Create database
DROP DATABASE IF EXISTS vakantie_vila;
CREATE DATABASE vakantie_vila;
USE vakantie_vila;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms DECIMAL(3,1) DEFAULT 1.0,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    amenities TEXT,
    image_url TEXT,
    status ENUM('available', 'sold', 'pending') DEFAULT 'available',
    property_type ENUM('apartment', 'house', 'villa', 'cabin', 'tent', 'loft') DEFAULT 'villa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20),
    description VARCHAR(255),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Hero images table
CREATE TABLE IF NOT EXISTS hero_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL
);

-- Admin user
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
('admin', 'admin@example.com', '$2y$10$uM6NLKj9IGNM1Fxua8zyA.XhbzMRxJ7Vy6yXmeFEC.x7hEKxZzb6C', 'Admin', 'User', 'admin');
