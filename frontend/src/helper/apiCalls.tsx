import {
  BaseCharacter,
  UniqueCharacterData,
  StatBlock,
} from "../types/Fire Emblem Fates/UnitStruct";
import { applyBoonBaneAdjustments } from "../utils/Fire Emblem Fates/characterAdjustments";

export async function fetchUnits(
  gameId: string,
  token: string,
): Promise<any[] | null> {
  try {
    const response = await fetch(`/api/units/${encodeURIComponent(gameId)}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fetch units error:", errorData.error);
      return null;
    }

    const units = await response.json();
    return units;
  } catch (error) {
    console.error("Unexpected fetch error:", error);
    return null;
  }
}

export async function setUserUnit(
  gameId: string,
  characterData: BaseCharacter,
): Promise<{ success: boolean; message?: string }> {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  const updatedClassLine: [number, number, string, StatBlock][] =
    characterData.class_line.map((entry: any) => {
      const [level, sealCount, classObj, statBlock] = entry;
      return [level, sealCount, classObj.className, statBlock];
    });

  const updatedData: UniqueCharacterData = {
    name: characterData.name,
    path: characterData.path ?? "Conquest",
    class: characterData.class.className,
    internalLevel: characterData.internalLevel,
    level: characterData.level,
    eternalSealCount: characterData.eternalSealCount,
    class_line: updatedClassLine,
    stats: characterData.stats,
    equipped_skills: characterData.equipped_skills.map(
      (skill: any) => skill.name,
    ),
    learned_skills: characterData.learned_skills.map(
      (skill: any) => skill.name,
    ),
    weapon_ranks: characterData.weapon_ranks,
    weapons: characterData.starting_weapons,
    selected_partner_seal_partner:
      characterData.base_class_set.selected_partner_seal_partner?.name ?? null,
    selected_friendship_seal_partner:
      characterData.base_class_set.selected_friendship_seal_partner?.name ??
      null,
    boon: characterData.boon ?? undefined,
    bane: characterData.bane ?? undefined,
    talent: characterData.talent ?? undefined,
  };

  try {
    const res = await fetch(`/api/units/${encodeURIComponent(gameId)}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.error || "Server error" };
    }

    return { success: true };
  } catch (err) {
    console.error("Error posting unit:", err);
    return { success: false, message: "Network or server error" };
  }
}

export async function deleteAllUnits(
  gameId: string,
  path: string,
): Promise<{ success: boolean; message?: string }> {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(
      `/api/units/${encodeURIComponent(gameId)}/${encodeURIComponent(path)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Delete units error:", errorData.error);
      return {
        success: false,
        message: errorData.error || "Failed to delete units",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected deletion error:", error);
    return { success: false, message: "Unexpected error occurred" };
  }
}

export async function deleteUnitByName(
  gameId: string,
  path: string,
  unitName: string,
): Promise<{ success: boolean; message?: string }> {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(
      `/api/units/${encodeURIComponent(gameId)}/${encodeURIComponent(path)}/${unitName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Delete unit error:", errorData.error);
      return {
        success: false,
        message: errorData.error || "Failed to delete unit",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected unit deletion error:", error);
    return { success: false, message: "Unexpected error occurred" };
  }
}
