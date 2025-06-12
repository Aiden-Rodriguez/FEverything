import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import NavBar from "./components/NavBar.tsx";
import Averages from "./pages/Averages.tsx";
import Units from "./pages/Units.tsx";
import CombatSimulator from "./pages/CombatSimulator.tsx";
import GamePage from "./pages/GamePage.tsx";
import About from "./pages/About.tsx";
import AuthForm from "./pages/AuthForm.tsx";
import { ValidRoutes } from "../../backend/src/shared/validRoutes.ts";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenExpiration } from "./helper/jwtUtils.tsx";
import {
  fetchUnits,
  setUserUnit,
  deleteAllUnits,
  deleteUnitByName,
} from "./helper/apiCalls.tsx";
import { parseUnitData } from "./helper/parseUnits.tsx";
import { BaseCharacter } from "./types/Fire Emblem Fates/UnitStruct.tsx";
import LoadingOverlay from "./components/fetchingOverlay.tsx";

function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const exp = getTokenExpiration();
      if (!exp) return;

      const now = Date.now();
      if (now >= exp) {
        console.log("Token expired — auto-logging out.");
        localStorage.removeItem("token");

        sessionStorage.setItem("sessionExpired", "true");

        navigate("/login");
      }
    };

    const interval = setInterval(check, 10000); // check every 10 seconds
    return () => clearInterval(interval);
  }, []);
}

function AppRoutes() {
  const [units, setUnits] = useState<BaseCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDBError, setIsDBError] = useState(false);

  async function getUserUnits(gameId: string): Promise<any[] | null> {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No auth token found");
      return null;
    }

    const data = await fetchUnits(gameId, token);
    if (data === null) {
      console.log("Failed to fetch units or no units exist for user");
      return null;
    }
    return data;
  }

  async function loadUnits() {
    setIsLoading(true);
    const fetchedUnits = await getUserUnits("Fire Emblem Fates");  
    if (fetchedUnits) {
      const parsedUnits = parseUnitData(fetchedUnits);
      setUnits(parsedUnits);
      // console.log(parsedUnits)
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      setIsDBError(true)
    }
  }

  useEffect(() => {
    loadUnits();
  }, []);

  async function updateUserUnit(gameId: string, characterData: BaseCharacter) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No auth token found");
      return;
    }

    setUnits((prevUnits) => {
      const index = prevUnits.findIndex(
        (unit) => unit.name === characterData.name,
      );

      if (index !== -1) {
        // Replace the existing unit
        const updatedUnits = [...prevUnits];
        updatedUnits[index] = characterData;
        return updatedUnits;
      } else {
        // Add the new unit
        return [...prevUnits, characterData];
      }
    });

    await setUserUnit(gameId, characterData);
    // console.log(result)
    return;
  }

  async function deleteAllUserUnits(
    gameId: string,
    path: string,
  ): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No auth token found");
      return false;
    }

    const result = await deleteAllUnits(gameId, path);
    if (!result || !result.success) {
      return false;
    }

    setUnits([]);
    return true;
  }

  async function deleteUserUnitByName(
    gameId: string,
    path: string,
    unitName: string,
  ): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No auth token found");
      return false;
    }

    const result = await deleteUnitByName(gameId, path, unitName);
    if (!result || !result.success) {
      console.log(`Failed to delete unit ${unitName}`);
      return false;
    }

    setUnits(units.filter((unit) => unit.name !== unitName));
    return true;
  }

  useAutoLogout();
  return (
    <>
      <NavBar />
      <LoadingOverlay isLoading={isLoading} isDBError={isDBError} />
      <Routes>
        <Route path={ValidRoutes.HOME} element={<Home />} />
        <Route path={ValidRoutes.ABOUT} element={<About />} />
        <Route
          path={ValidRoutes.LOGIN}
          element={<AuthForm loadUnits={loadUnits} />}
        />
        <Route
          path={ValidRoutes.SIGNUP}
          element={<AuthForm loadUnits={loadUnits} />}
        />
        <Route path={ValidRoutes.NOTFOUND} element={<NotFound />} />

        <Route
          path={ValidRoutes.AVERAGES}
          element={
            <ProtectedRoute>
              <Averages units={units} isLoading={isLoading} />
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.UNITS}
          element={
            <ProtectedRoute>
              <Units
                units={units}
                updateUnit={updateUserUnit}
                deleteUnitByName={deleteUserUnitByName}
                deleteAllUnits={deleteAllUserUnits}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.COMBATSIMULATOR}
          element={
            <ProtectedRoute>
              <CombatSimulator units={units} />
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.GAMEPAGE}
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
