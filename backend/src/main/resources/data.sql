INSERT INTO campuses (id, name, location) VALUES
('campus-1', 'IIT Bombay', 'Mumbai'),
('campus-2', 'BITS Pilani', 'Pilani'),
('campus-3', 'Delhi University', 'Delhi'),
('campus-4', 'VIT Vellore', 'Vellore'),
('campus-5', 'NIT Trichy', 'Tiruchirappalli');

INSERT INTO users (id, email, password, name, college, role, created_at) VALUES
('user-1', 'aarav@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Aarav S.', 'IIT Bombay', 'STUDENT', NOW()),
('user-2', 'meera@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Meera K.', 'Delhi University', 'STUDENT', NOW()),
('user-3', 'rohan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rohan P.', 'BITS Pilani', 'STUDENT', NOW());

INSERT INTO marketplace_items (id, title, price, category, condition, description, image_url, seller_id, college, status, created_at) VALUES
('item-1', 'DSA Textbook (Cormen)', 450.00, 'Books', 'Like new', 'Barely used. Perfect for algorithm prep.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80', 'user-1', 'IIT Bombay', 'AVAILABLE', NOW()),
('item-2', 'Scientific Calculator', 350.00, 'Electronics', 'Good', 'Casio fx-991ES Plus. Works perfectly.', 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80', 'user-2', 'Delhi University', 'AVAILABLE', NOW()),
('item-3', 'Mountain Bike', 6500.00, 'Vehicles', 'Used', '21 gears, well maintained.', 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&auto=format&fit=crop&q=80', 'user-3', 'BITS Pilani', 'AVAILABLE', NOW());

INSERT INTO lost_found_items (id, title, category, location, date, description, image_url, type, status, contact, reported_by_id, created_at) VALUES
('lf-1', 'Black Backpack', 'Bags', 'Library', '2026-08-07', 'Lost near the library entrance.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 'LOST', 'OPEN', 'aarav@example.com', 'user-1', NOW()),
('lf-2', 'Blue Water Bottle', 'Accessories', 'Sports Complex', '2026-08-08', 'Found near the basketball court.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', 'FOUND', 'OPEN', 'meera@example.com', 'user-2', NOW());

INSERT INTO events (id, title, date, time, location, description, organizer, attendees, image_url, category, created_at) VALUES
('event-1', 'Tech Fest 2026', '2026-08-15', '10:00 AM', 'Main Auditorium', 'Annual technical festival.', 'Tech Club', 340, 'https://images.unsplash.com/photo-1540575467068-1d4392e9e4e8?w=800&auto=format&fit=crop&q=80', 'Technical', NOW()),
('event-2', 'Cultural Night', '2026-08-20', '6:00 PM', 'Open Air Theatre', 'An evening of music and dance.', 'Cultural Committee', 500, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80', 'Cultural', NOW());
