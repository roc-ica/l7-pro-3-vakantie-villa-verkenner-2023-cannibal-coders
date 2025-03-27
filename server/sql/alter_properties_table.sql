-- Add featured column to properties table
ALTER TABLE properties ADD COLUMN featured BOOLEAN DEFAULT FALSE;
