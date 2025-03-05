-- Wait for the database to be fully ready
SELECT 'Starting data insertion...' as '';

-- Use the database
USE vakantie_vila;

-- This will help prevent potential foreign key issues
SET FOREIGN_KEY_CHECKS=0;

-- Clear existing data to avoid duplicates on rebuild
TRUNCATE TABLE property_images;
DELETE FROM properties;
-- Don't truncate users as we want to keep the admin accounts from database.sql

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Insert admin and regular user accounts
-- In a production environment, passwords should be hashed
INSERT INTO users (username, email, password, first_name, last_name, role, created_at) VALUES
('admin', 'admin@example.com', '$2y$10$uM6NLKj9IGNM1Fxua8zyA.XhbzMRxJ7Vy6yXmeFEC.x7hEKxZzb6C', 'Admin', 'User', 'admin', NOW()),
('user', 'user@example.com', '$2y$10$1LKZ9VLdHCjHdq1xHrPuPeh8kB1sFe7eHpWkW4BDfwxEvBRqPwAJO', 'Regular', 'User', 'user', NOW());

-- Noorwegen properties with all required fields including bathrooms
INSERT INTO properties (name, location, country, address, capacity, bedrooms, bathrooms, price, description, amenities, image_url, property_type, status) VALUES
('Fjord Retreat', 'Geirangerfjord', 'Noorwegen', 'Fjordveien 123, Geiranger', 6, 3, 2.0, 300000, 'Moderne blokhut met panoramisch uitzicht op de majestueuze Geirangerfjord. Dicht bij een bos en aan het water.', 'wifi,parking,hottub,tv,kitchen', 'https://images.unsplash.com/photo-1601922046210-99885dd0910f', 'cabin', 'available'),
('Bergtop Haven', 'Jotunheimen National Park', 'Noorwegen', 'Toppenweg 456, Lom', 8, 4, 3.0, 150000, 'Ruime bergwoning met directe toegang tot wandelpaden. Inclusief overname inventaris.', 'wifi,parking,ac,security', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2', 'house', 'available'),
('Lakeside Cabin', 'Telemark', 'Noorwegen', 'Vatnavn 789, Kragerø', 4, 2, 1.0, 100000, 'Gezellige blokhut aan een idyllisch meer, perfect voor natuurliefhebbers. Op een privépark.', 'wifi,parking,pets,kitchen', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7', 'cabin', 'available');

-- Add images for Fjord Retreat (property_id 1)
INSERT INTO property_images (property_id, image_url, image_type, description) VALUES
(1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'interior', 'Living Room'),
(1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', 'interior', 'Kitchen'),
(1, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 'interior', 'Master Bedroom'),
(1, 'https://images.unsplash.com/photo-1601922046210-99885dd0910f', 'exterior', 'Front View'),
(1, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'surroundings', 'Fjord View');

-- Insert sample hero images
INSERT INTO hero_images (url, location) VALUES
    ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 'Bondi Beach, Sydney'),
    ('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', 'Great Barrier Reef'),
    ('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', 'Gold Coast');

-- Marokko properties
INSERT INTO properties (name, location, country, address, capacity, bedrooms, bathrooms, price, description, amenities, image_url, property_type, status) VALUES
('Atlas Oasis Villa', 'Marrakech', 'Marokko', 'Palmeraie Road, Marrakech', 8, 4, 3.5, 110000, 'Traditionele villa met uitzicht op het Atlasgebergte. Zwembad op het park en winkel op het park.', 'wifi,parking,pool,ac', 'https://images.unsplash.com/photo-1582568741847-0d71f5b77f78', 'villa', 'available'),
('Sahara Nomad Tent', 'Erg Chebbi Desert', 'Marokko', 'Desert Dunes, Merzouga', 4, 1, 1.0, 80000, 'Authentieke nomadentent in de Sahara. Unieke ervaring met sterrenhemel boven de woestijn.', 'wifi,parking,breakfast', 'https://images.unsplash.com/photo-1542401886-65d6c61db217', 'tent', 'available'),
('Kasbah Hideaway', 'Skoura Oasis', 'Marokko', 'Kasbah Lane, Skoura', 6, 3, 2.0, 195000, 'Charmante kasbah te midden van palmbomen. Entertainment op het park met traditionele muziek en dans.', 'wifi,parking,entertainment', 'https://images.unsplash.com/photo-1548018560-c7196d4b677a', 'house', 'available');

-- Add images for Moroccan properties
INSERT INTO property_images (property_id, image_url, image_type, description) VALUES
(4, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'interior', 'Living Area'),
(4, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', 'exterior', 'Pool View'),
(5, 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1', 'interior', 'Tent Interior');

-- Nederland properties
INSERT INTO properties (name, location, country, address, capacity, bedrooms, bathrooms, price, description, amenities, image_url, property_type, status) VALUES
('Waterfront Haven', 'Zeeland', 'Nederland', 'Havenstraat 89, Zeeland', 6, 3, 2.0, 360000, 'Moderne woning aan het water met eigen aanlegsteiger. Perfect voor liefhebbers van watersport en rust.', 'wifi,parking,boatdock', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', 'house', 'available'),
('Duneview Cottage', 'Texel', 'Nederland', 'Duinweg 567, Texel', 5, 2, 1.5, 810000, 'Gezellig huisje met uitzicht op de duinen. Winkel op het park en entertainment in de buurt.', 'wifi,parking,entertainment', 'https://images.unsplash.com/photo-1518780664495-55c3e3e8ad36', 'house', 'available'),
('City Loft', 'Amsterdam', 'Nederland', 'Keizersgracht 789, Amsterdam', 4, 2, 1.0, 1180000, 'Stijlvol appartement in het hart van Amsterdam. Dicht bij een stad en winkels op het park.', 'wifi,parking,cityview', 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4', 'apartment', 'available');

-- Add images for Dutch properties
INSERT INTO property_images (property_id, image_url, image_type, description) VALUES
(7, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', 'exterior', 'Front View'),
(7, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', 'interior', 'Living Room'),
(8, 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc', 'surroundings', 'Dune View');

-- Verify data insertion was successful
SELECT CONCAT('Successfully inserted: ', COUNT(*), ' properties') AS 'Properties' FROM properties;
SELECT CONCAT('Successfully inserted: ', COUNT(*), ' property images') AS 'Images' FROM property_images;
