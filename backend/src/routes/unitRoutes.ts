import { Router, Request, Response, Application } from "express";
import { Pool } from "pg";

export function registerUnitRoutes(app: Application, pool: Pool, verifyAuthToken: any): void {
  app.post("/api/units/:gameId/", verifyAuthToken, async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const unitData = req.body;
    const username = req.user?.username;

    if (!username) {
      res.status(401).json({ error: "Unauthorized: No user information in token" });
      return;
    }

    const allowedGames = ["Fire Emblem Fates"];
    if (!allowedGames.includes(gameId)) {
      res.status(400).json({ error: "Unsupported gameId" });
      return;
    }

    if (
      !unitData ||
      typeof unitData.name !== "string" ||
      typeof unitData.class !== "string" ||
      typeof unitData.level !== "number" ||
      typeof unitData.stats !== "object" ||
      typeof unitData.internalLevel !== "number" ||
      typeof unitData.eternalSealCount !== "number" ||
      !Array.isArray(unitData.class_line) ||
      !Array.isArray(unitData.equipped_skills) ||
      !Array.isArray(unitData.learned_skills) ||
      typeof unitData.weapon_ranks !== "object" ||
      !Array.isArray(unitData.weapons)
    ) {
      res.status(400).json({ error: "Invalid or missing unit data in request body" });
      return;
    }

    try {
      const userQuery = `
        SELECT id
        FROM users
        WHERE username = $1
      `;
      const userResult = await pool.query(userQuery, [username]);
      if ((userResult.rowCount ?? 0) === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const userId = userResult.rows[0].id;

      const allowedPaths = ["Conquest", "Birthright", "Revalation"];
      let path = null;
      if (typeof unitData.path === "string") {
        if (allowedPaths.includes(unitData.path)) {
          path = unitData.path;
        } else {
          res.status(400).json({ error: "Invalid path" });
          return;
        }
      }
      const allowedBoons = [
        "Robust",
        "Strong",
        "Clever",
        "Deft",
        "Quick",
        "Lucky",
        "Sturdy",
        "Calm",
      ];
      const allowedBanes = [
        "Sickly",
        "Weak",
        "Dull",
        "Clumsy",
        "Slow",
        "Unlucky",
        "Fragile",
        "Excitable",
      ];
      const allowedTalents = [
        "Cavalier",
        "Knight",
        "Fighter",
        "Mercenary",
        "Outlaw",
        "Samurai",
        "Oni Savage",
        "Spear Fighter",
        "Diviner",
        "Shrine Maiden",
        "Monk",
        "Sky Knight",
        "Archer",
        "Wyvern Rider",
        "Ninja",
        "Dark Mage",
        "Troubadour",
        "Apothecary"
      ];

      let boon = null;
      if (typeof unitData.boon === "string") {
        if (allowedBoons.includes(unitData.boon)) {
          boon = unitData.boon;
        } else {
          res.status(400).json({ error: "Invalid boon" });
          return;
        }
      }
      let bane = null;
      if (typeof unitData.bane === "string") {
        if (allowedBanes.includes(unitData.bane)) {
          bane = unitData.bane;
        } else {
          res.status(400).json({ error: "Invalid bane" });
          return;
        }
      }
      let talent = null;
      if (typeof unitData.talent === "string") {
        if (allowedTalents.includes(unitData.talent)) {
          talent = unitData.talent;
        } else {
          res.status(400).json({ error: "Invalid talent" });
          return;
        }
      }
      let fsp = null;
      if (typeof unitData.selected_friendship_seal_partner === "string") {
        fsp = unitData.selected_friendship_seal_partner;
      }
      let psp = null;
      if (typeof unitData.selected_partner_seal_partner === "string") {
        psp = unitData.selected_partner_seal_partner;
      }

      const query = `
      INSERT INTO "${gameId}" (user_id, path, name, class, level, stats, "internalLevel", "eternalSealCount", class_line, equipped_skills, learned_skills, weapon_ranks, weapons, selected_partner_seal_partner, selected_friendship_seal_partner, boon, bane, talent) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (user_id, name, path)
      DO UPDATE SET 
        class = EXCLUDED.class,
        level = EXCLUDED.level,
        stats = EXCLUDED.stats,
        "internalLevel" = EXCLUDED."internalLevel",
        "eternalSealCount" = EXCLUDED."eternalSealCount",
        class_line = EXCLUDED.class_line,
        equipped_skills = EXCLUDED.equipped_skills,
        learned_skills = EXCLUDED.learned_skills,
        weapon_ranks = EXCLUDED.weapon_ranks,
        weapons = EXCLUDED.weapons,
        selected_partner_seal_partner = EXCLUDED.selected_partner_seal_partner,
        selected_friendship_seal_partner = EXCLUDED.selected_friendship_seal_partner,
        boon = EXCLUDED.boon,
        bane = EXCLUDED.bane,
        talent = EXCLUDED.talent
      `;

      const values = [
        userId,
        path,
        unitData.name,
        unitData.class,
        unitData.level,
        unitData.stats,
        unitData.internalLevel,
        unitData.eternalSealCount,
        JSON.stringify(unitData.class_line),
        unitData.equipped_skills,
        unitData.learned_skills,
        unitData.weapon_ranks,
        unitData.weapons,
        psp,
        fsp,
        boon,
        bane,
        talent
      ];

      await pool.query(query, values);
      res.json({ message: "Unit successfully saved" });
    } catch (err: unknown) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/units/:gameId/", verifyAuthToken, async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const username = req.user?.username;

    if (!username) {
      res.status(401).json({ error: "Unauthorized: No user information in token" });
      return;
    }

    const allowedGames = ["Fire Emblem Fates"];
    if (!allowedGames.includes(gameId)) {
      res.status(400).json({ error: "Unsupported gameId" });
      return;
    }

    try {
      const userQuery = `
        SELECT id
        FROM users
        WHERE username = $1
      `;
      const userResult = await pool.query(userQuery, [username]);
      if ((userResult.rowCount ?? 0) === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const userId = userResult.rows[0].id;

      const unitsQuery = `
        SELECT *
        FROM "${gameId}"
        WHERE user_id = $1
      `;
      const unitsResult = await pool.query(unitsQuery, [userId]);
      res.json(unitsResult.rows);
    } catch (err: unknown) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  });
}