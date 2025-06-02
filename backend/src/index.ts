import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

app.get("/users", async (req: Request, res: Response) => {
    console.log("DB URL:", process.env.SUPABASE_DB_URL);
  try {
    const result = await pool.query("SELECT username FROM users");
    res.json(result.rows);
  } catch (err: unknown) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
