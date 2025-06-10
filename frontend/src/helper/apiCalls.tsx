export async function fetchUnits(gameId: string, token: string): Promise<any[] | null> {
    try {
      const response = await fetch(`/api/units/${encodeURIComponent(gameId)}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
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
    unitData: any
  ): Promise<{ success: boolean; message?: string }> {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }
  
    try {
      const res = await fetch(`/api/units/${encodeURIComponent(gameId)}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unitData),
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