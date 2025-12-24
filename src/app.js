import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());
app.post("/api/v1/bookings/reserve", async (req, res) => {
  const { event_id, user_id } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({ message: "event_id and user_id are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const eventResult = await client.query(
      `SELECT id, total_seats
       FROM events
       WHERE id = $1
       FOR UPDATE`,
      [event_id]
    );

    if (eventResult.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { total_seats } = eventResult.rows[0];

    const countResult = await client.query(
      `SELECT COUNT(*)::int AS count
       FROM bookings
       WHERE event_id = $1`,
      [event_id]
    );

    if (countResult.rows[0].count >= total_seats) {
      return res.status(409).json({ message: "No available seats" });
    }

    await client.query(
      `INSERT INTO bookings (event_id, user_id, created_at)
       VALUES ($1, $2, NOW())`,
      [event_id, user_id]
    );

    await client.query("COMMIT");
    return res.status(201).json({ message: "Seat successfully reserved" });

  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      return res.status(409).json({
        message: "User has already booked this event"
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
});

export default app;