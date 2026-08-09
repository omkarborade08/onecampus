-- OneCampus Seed Data
-- Inserts sample data into the Neon database for development and testing.

-- Campuses
INSERT INTO campuses (id, name, location) VALUES
('campus-1', 'IIT Bombay', 'Mumbai'),
('campus-2', 'BITS Pilani', 'Pilani'),
('campus-3', 'Delhi University', 'Delhi'),
('campus-4', 'VIT Vellore', 'Vellore'),
('campus-5', 'NIT Trichy', 'Tiruchirappalli')
ON CONFLICT (name) DO NOTHING;

-- Users (passwords are BCrypt hashes of 'password123')
INSERT INTO users (id, email, password, name, college, role, created_at, online, last_seen) VALUES
('user-1', 'aarav@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Aarav S.', 'IIT Bombay', 'STUDENT', NOW(), FALSE, NOW()),
('user-2', 'meera@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Meera K.', 'Delhi University', 'STUDENT', NOW(), FALSE, NOW()),
('user-3', 'rohan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rohan P.', 'BITS Pilani', 'STUDENT', NOW(), FALSE, NOW()),
('user-4', 'priya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Priya N.', 'VIT Vellore', 'STUDENT', NOW(), FALSE, NOW()),
('user-5', 'ishaan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ishaan T.', 'NIT Trichy', 'STUDENT', NOW(), FALSE, NOW())
ON CONFLICT (email) DO NOTHING;

-- Marketplace Items
INSERT INTO marketplace_items (id, title, price, category, condition, description, image_url, seller_id, college, status, created_at) VALUES
('item-1', 'DSA Textbook (Cormen)', 450.00, 'Books', 'Like new', 'Barely used. Perfect for algorithm prep.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80', 'user-1', 'IIT Bombay', 'AVAILABLE', NOW()),
('item-2', 'Scientific Calculator', 350.00, 'Electronics', 'Good', 'Casio fx-991ES Plus. Works perfectly.', 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80', 'user-2', 'Delhi University', 'AVAILABLE', NOW()),
('item-3', 'Mountain Bike', 6500.00, 'Vehicles', 'Used', '21 gears, well maintained. Great for campus.', 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&auto=format&fit=crop&q=80', 'user-3', 'BITS Pilani', 'AVAILABLE', NOW()),
('item-4', 'Study Lamp', 600.00, 'Furniture', 'Like new', 'Warm-light LED with dimmer.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', 'user-4', 'VIT Vellore', 'AVAILABLE', NOW()),
('item-5', 'Wireless Headphones', 2200.00, 'Electronics', 'Good', 'Sony WH-CH510, great battery life.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 'user-5', 'NIT Trichy', 'AVAILABLE', NOW()),
('item-6', 'Mini Fridge', 4500.00, 'Appliances', 'Used', 'Perfect for hostel room.', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=80', 'user-1', 'IIT Bombay', 'AVAILABLE', NOW()),
('item-7', 'Acoustic Guitar', 3200.00, 'Music', 'Good', 'Yamaha F310, with case.', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80', 'user-2', 'Delhi University', 'AVAILABLE', NOW()),
('item-8', 'Lab Coat (Size M)', 250.00, 'Clothing', 'New', 'Unworn, tags on.', 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80', 'user-3', 'BITS Pilani', 'AVAILABLE', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lost & Found Items
INSERT INTO lost_found_items (id, title, category, location, date, description, image_url, type, status, contact, reported_by_id, created_at) VALUES
('lf-1', 'Black Backpack', 'Bags', 'Library', '2026-08-07', 'Lost near the library entrance. Contains laptop charger and notebooks.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 'LOST', 'OPEN', 'aarav@example.com', 'user-1', NOW()),
('lf-2', 'Blue Water Bottle', 'Accessories', 'Sports Complex', '2026-08-08', 'Found near the basketball court. Insulated bottle with campus logo.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', 'FOUND', 'OPEN', 'meera@example.com', 'user-2', NOW()),
('lf-3', 'Student ID Card', 'Documents', 'Cafeteria', '2026-08-06', 'Lost near the main cafeteria. Name: Rohan Patil, Roll: 2024CS1056', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80', 'LOST', 'OPEN', 'rohan@example.com', 'user-3', NOW()),
('lf-4', 'Wireless Earbuds', 'Electronics', 'Hostel C', '2026-08-08', 'Found in the common room of Hostel C. White color, in charging case.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', 'FOUND', 'OPEN', 'priya@example.com', 'user-4', NOW()),
('lf-5', 'Calculus Textbook', 'Books', 'Lecture Hall 3', '2026-08-05', 'Left behind in LH-3 after the math lecture. Has my name on the first page.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80', 'LOST', 'OPEN', 'ishaan@example.com', 'user-5', NOW())
ON CONFLICT (id) DO NOTHING;

-- Events
INSERT INTO events (id, title, date, time, location, description, organizer, attendees, image_url, category, created_at) VALUES
('event-1', 'Tech Fest 2026', '2026-08-15', '10:00 AM', 'Main Auditorium', 'Annual technical festival with hackathons, workshops, and guest lectures.', 'Tech Club', 340, 'https://images.unsplash.com/photo-1540575467068-1d4392e9e4e8?w=800&auto=format&fit=crop&q=80', 'Technical', NOW()),
('event-2', 'Cultural Night', '2026-08-20', '6:00 PM', 'Open Air Theatre', 'An evening of music, dance, and drama performances by student groups.', 'Cultural Committee', 500, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80', 'Cultural', NOW()),
('event-3', 'Hackathon: Build for Good', '2026-09-01', '9:00 AM', 'Innovation Lab', '24-hour hackathon focused on social impact projects. Prizes worth ₹50,000.', 'CSI Student Branch', 120, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80', 'Technical', NOW()),
('event-4', 'Blood Donation Camp', '2026-08-25', '9:00 AM', 'Health Centre', 'Voluntary blood donation camp in association with Red Cross Society.', 'NSS Unit', 200, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80', 'Social', NOW())
ON CONFLICT (id) DO NOTHING;

-- Conversations
INSERT INTO conversations (id, name, initials, last_message, time, online, unread, participant_id, created_at) VALUES
('conv-1', 'Aarav S.', 'AS', 'Is the textbook still available?', '2m', TRUE, 2, 'user-1', NOW()),
('conv-2', 'Meera K.', 'MK', 'Cool, see you at the library!', '1h', TRUE, 0, 'user-2', NOW()),
('conv-3', 'CS Study Group', 'CS', 'Priya: notes uploaded ✅', '3h', FALSE, 5, 'user-3', NOW()),
('conv-4', 'Rohan P.', 'RP', 'Thanks for the bike pics', '1d', FALSE, 0, 'user-4', NOW()),
('conv-5', 'Hostel C — Floor 3', 'H3', 'Power''s back 💡', '2d', FALSE, 0, 'user-5', NOW())
ON CONFLICT (id) DO NOTHING;

-- Messages
INSERT INTO messages (id, text, mine, time, conversation_id, sender_id, created_at) VALUES
('msg-1', 'Hey! Saw your DSA textbook listing — still available?', FALSE, '10:14', 'conv-1', 'user-1', NOW()),
('msg-2', 'Yes, still available!', TRUE, '10:15', 'conv-1', 'user-1', NOW()),
('msg-3', 'Awesome. Can we meet at the library tomorrow?', FALSE, '10:15', 'conv-1', 'user-1', NOW()),
('msg-4', 'Sure, 4pm works for me. Ground floor entrance?', TRUE, '10:16', 'conv-1', 'user-1', NOW()),
('msg-5', 'Perfect. See you then!', FALSE, '10:17', 'conv-1', 'user-1', NOW())
ON CONFLICT (id) DO NOTHING;

