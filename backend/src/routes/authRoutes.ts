import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserProvider } from "../userProvider";

interface IAuthTokenPayload {
  username: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IAuthTokenPayload;
  }
}

export function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, req.app.locals.JWT_SECRET as string, (error, decoded) => {
      if (decoded) {
        req.user = decoded as IAuthTokenPayload;
        next();
      } else {
        res.status(403).end();
      }
    });
  }
}

function generateAuthToken(
  username: string,
  jwtSecret: string,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const payload: IAuthTokenPayload = {
      username,
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "1d" }, (error, token) => {
      if (error) reject(error);
      else resolve(token as string);
    });
  });
}

export function registerAuthRoutes(
  app: express.Application,
  pool: Pool,
  userProvider: UserProvider,
) {
  app.post(
    "/auth/register",
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          res.status(400).json({
            error: "Bad request",
            message: "Missing username or password",
          });
          return;
        }

        if (username.length < 5) {
          res.status(400).json({
            error: "Invalid username",
            message: "Username must be at least 5 characters long",
          });
          return;
        }

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
          res.status(400).json({
            error: "Invalid password",
            message:
              "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @$!%*?&)",
          });
          return;
        }
        const userCreated = await userProvider.createUser(username, password);
        if (!userCreated) {
          res.status(409).json({
            error: "Username already taken",
            message: "A user with this username already exists",
          });
          return;
        }

        const jwtSecret = req.app.locals.JWT_SECRET;
        const token = await generateAuthToken(username, jwtSecret);
        res.status(201).json({ token });
      } catch (error: unknown) {
        console.error("Failed to register:", error);
        if (
          error instanceof Error &&
          error.message.includes("Failed to create user in database")
        ) {
          res.status(500).json({
            error: "Database error",
            message: "Failed to create user",
          });
        } else {
          res.status(500).json({
            error: "Internal server error",
            message: "Failed to register user",
          });
        }
      }
    },
  );

  app.post(
    "/auth/login",
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          res.status(400).json({
            error: "Bad request",
            message: "Missing username or password",
          });
          return;
        }

        const isValid = await pool
          .query(`SELECT password FROM users WHERE username = $1`, [username])
          .then((result) => {
            if ((result.rowCount ?? 0) === 0) return false;
            return bcrypt.compare(password, result.rows[0].password);
          });

        if (!isValid) {
          res.status(401).json({
            error: "Unauthorized",
            message: "Invalid username or password",
          });
          return;
        }

        const jwtSecret = req.app.locals.JWT_SECRET;
        const token = await generateAuthToken(username, jwtSecret);
        res.status(200).json({ token });
      } catch (error) {
        console.error("Failed to login:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );
}
