-- Migration script to update existing conversations table
-- Run this if you already have the old schema with participant_id

-- Add optional mobile number to existing users
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(30);

-- First, add new columns
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS buyer_id VARCHAR(36) REFERENCES users(id);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS seller_id VARCHAR(36) REFERENCES users(id);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS unread_buyer INTEGER NOT NULL DEFAULT 0;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS unread_seller INTEGER NOT NULL DEFAULT 0;

-- Add message columns
ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'TEXT';

-- Drop old columns if they exist
ALTER TABLE conversations DROP COLUMN IF EXISTS participant_id;
ALTER TABLE conversations DROP COLUMN IF EXISTS unread;

-- Drop old indexes
DROP INDEX IF EXISTS idx_conversations_participant;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON conversations(buyer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_seller ON conversations(seller_id, created_at);
