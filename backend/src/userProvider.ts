import { Pool } from "pg";
import bcrypt from "bcrypt";

export class UserProvider {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createUser(username: string, password: string): Promise<boolean> {
    try {
      const existingUserQuery = `
                SELECT username
                FROM users
                WHERE username = $1
            `;
      const existingUserResult = await this.pool.query(existingUserQuery, [
        username,
      ]);
      if ((existingUserResult.rowCount ?? 0) > 0) {
        return false;
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const insertQuery = `
                INSERT INTO users (username, password)
                VALUES ($1, $2)
            `;
      await this.pool.query(insertQuery, [username, hash]);

      return true;
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      if (error instanceof Error && "code" in error && error.code === "23502") {
        throw new Error(
          "Database schema error: NOT NULL constraint violated. Ensure all required columns are provided.",
        );
      }
      throw new Error("Failed to create user in database");
    }
  }
}
