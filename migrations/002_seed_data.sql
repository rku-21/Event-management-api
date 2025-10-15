INSERT INTO users (name, email) VALUES
('Rahul Kumar', 'rahul.kumar@example.com'),
('Shreya Singh', 'shreya.singh@example.com'),
('Aman Verma', 'aman.verma@example.com'),
('Priya Sharma', 'priya.sharma@example.com'),
('Rohit Patel', 'rohit.patel@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO events (title, date_time, location, capacity) VALUES
('Tech Innovators Meetup', '2025-11-15 09:30:00', 'Bengaluru', 500),
('Full Stack Bootcamp', '2025-10-20 14:00:00', 'Hyderabad', 100),
('AI & ML Conference', '2025-12-01 10:00:00', 'Delhi', 1000),
('Startup Founders Meetup', '2025-10-18 18:30:00', 'Mumbai', 50)
ON CONFLICT DO NOTHING;

