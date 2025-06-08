import { Pool } from "pg";
import bcrypt from "bcrypt";

export class CredentialsProvider {
    private readonly pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async verifyPassword(username: string, plaintextPassword: string): Promise<boolean> {
        try {
            const query = `
                SELECT password
                FROM users
                WHERE username = $1
            `;
            const result = await this.pool.query(query, [username]);
            if ((result.rowCount ?? 0) === 0) {
                return false;
            }

            const hashedPassword = result.rows[0].password;
            return await bcrypt.compare(plaintextPassword, hashedPassword);
        } catch (error) {
            console.error("Error verifying password:", error);
            return false;
        }
    }
}