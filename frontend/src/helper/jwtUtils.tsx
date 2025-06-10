import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username: string;
  exp: number;
}

export function getTokenExpiration(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000; // convert to ms
  } catch {
    return null;
  }
}
