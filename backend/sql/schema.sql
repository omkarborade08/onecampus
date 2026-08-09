-- OneCampus PostgreSQL Schema
-- Run this against your Neon database to set up tables explicitly.
-- Hibernate will also auto-create tables via ddl-auto=update, but this
-- script lets you inspect and manage the schema directly.

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL,
    mobile VARCHAR(30),
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Campuses table
CREATE TABLE IF NOT EXISTS campuses (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL
);

-- Marketplace items table
CREATE TABLE IF NOT EXISTS marketplace_items (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    condition VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    seller_id VARCHAR(36) NOT NULL REFERENCES users(id),
    college VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lost & Found items table
CREATE TABLE IF NOT EXISTS lost_found_items (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    contact VARCHAR(255) NOT NULL,
    reported_by_id VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(10),
    last_message TEXT,
    time VARCHAR(50),
    online BOOLEAN NOT NULL DEFAULT FALSE,
    unread_buyer INTEGER NOT NULL DEFAULT 0,
    unread_seller INTEGER NOT NULL DEFAULT 0,
    buyer_id VARCHAR(36) NOT NULL REFERENCES users(id),
    seller_id VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    text TEXT NOT NULL,
    image_url TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'TEXT',
    mine BOOLEAN NOT NULL DEFAULT FALSE,
    time VARCHAR(50) NOT NULL,
    conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
    sender_id VARCHAR(36) REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    time VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    organizer VARCHAR(255) NOT NULL,
    attendees INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_marketplace_status_category ON marketplace_items(status, category);
CREATE INDEX IF NOT EXISTS idx_lostfound_type_status ON lost_found_items(type, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON conversations(buyer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_seller ON conversations(seller_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

