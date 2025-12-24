# Booking System API

Simple seat reservation API for events.

## Features
- One user cannot book the same event twice
- Seats cannot exceed event capacity
- Transaction-safe implementation
- PostgreSQL constraints for data integrity

## Tech Stack
- Node.js
- Express
- PostgreSQL

## Design Decisions

- Database-level unique constraint prevents duplicate bookings
- Transactions + row-level locking (`SELECT FOR UPDATE`) ensure consistency
- Business logic is kept inside the API layer
- Database is the source of truth for seat availability

## API

### POST /api/v1/bookings/reserve

Request body:
```json
{
  "event_id": 1,
  "user_id": "user123"
}