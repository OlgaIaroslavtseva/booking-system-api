CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id),
  user_id VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- TODO: Add a column with the total number of booked seats