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
    url VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table with CASCADE delete
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    user_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create favorites table with CASCADE delete
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create default admin and user accounts
-- Password for both accounts is 'password123'
INSERT INTO users (username, email, password, first_name, last_name, role, created_at) VALUES
('admin', 'admin@example.com', '$2y$10$uM6NLKj9IGNM1Fxua8zyA.XhbzMRxJ7Vy6yXmeFEC.x7hEKxZzb6C', 'Admin', 'User', 'admin', NOW()),
('user', 'user@example.com', '$2y$10$1LKZ9VLdHCjHdq1xHrPuPeh8kB1sFe7eHpWkW4BDfwxEvBRqPwAJO', 'Regular', 'User', 'user', NOW());

-- Add sample hero images
INSERT INTO hero_images (url, location) VALUES
('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', 'Luxury Villa, Bali'),
('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2', 'Mountain Retreat, Norway'),
('https://images.unsplash.com/photo-1470770841072-f978cf4d019e', 'Lakeside Cabin, Canada');

-- Add this at the end of your database.sql file to verify data
SELECT 'Verifying database setup...' as '';
SELECT COUNT(*) as property_count FROM properties;
SELECT COUNT(*) as image_count FROM property_images;
