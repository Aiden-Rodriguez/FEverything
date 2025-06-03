import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import { ValidRoutes } from "./shared/validRoutes";

dotenv.config();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

async function startServer() {
  const app = express();
  app.use(express.json());
  const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  app.use(express.static(STATIC_DIR));

  app.get(Object.values(ValidRoutes), (req, res) => {
    res.sendFile("index.html", { root: STATIC_DIR });
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  // app.get("/api/users", async (req: Request, res: Response) => {
  //   try {
  //     const result = await pool.query("SELECT username FROM users");
  //     res.json(result.rows);
  //   } catch (err: unknown) {
  //     console.error("Database error:", err);
  //     res.status(500).send("Database error");
  //   }
  // });

  app.post("/api/units/:userId/:gameId/", async (req: Request, res: Response) => {
    const { userId, gameId } = req.params;
    const unitData = req.body;
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
      let fsp = null
      if (typeof unitData.selected_friendship_seal_partner === "string") {
        fsp = unitData.selected_friendship_seal_partner
      }
      let psp = null
      if (typeof unitData.selected_partner_seal_partner === "string") {
        psp = unitData.selected_partner_seal_partner
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
      return;
    } catch (err: unknown) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
  });  
}


startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
