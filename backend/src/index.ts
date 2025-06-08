import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import { ValidRoutes } from "./shared/validRoutes";
import { registerUnitRoutes } from "./routes/unitRoutes";
import { registerAuthRoutes, verifyAuthToken } from "./routes/authRoutes";
import { UserProvider } from "./userProvider";

dotenv.config();

const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET from env file");
}

async function startServer() {
  try {
    const app = express();
    app.use(express.json());



    const pool = new Pool({
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    app.locals.JWT_SECRET = JWT_SECRET;

    const userProvider = new UserProvider(pool);

    app.use(express.static(STATIC_DIR));

    app.use("/api/*", verifyAuthToken);

    registerAuthRoutes(app, pool, userProvider);
    registerUnitRoutes(app, pool, verifyAuthToken);

    app.get(Object.values(ValidRoutes), (req: Request, res: Response) => {
      res.sendFile("index.html", { root: STATIC_DIR });
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();