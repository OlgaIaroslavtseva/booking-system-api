ALTER TABLE bookings
ADD CONSTRAINT unique_event_user UNIQUE (event_id, user_id);