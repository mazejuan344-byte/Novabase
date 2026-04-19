-- Add front/back ID image fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS id_front_image TEXT,
ADD COLUMN IF NOT EXISTS id_back_image TEXT;

