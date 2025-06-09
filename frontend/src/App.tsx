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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenExpiration } from "./helper/jwtUtils.tsx";

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
  useAutoLogout();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path={ValidRoutes.HOME} element={<Home />} />
        <Route path={ValidRoutes.ABOUT} element={<About />} />
        <Route path={ValidRoutes.LOGIN} element={<AuthForm />} />
        <Route path={ValidRoutes.SIGNUP} element={<AuthForm />} />
        <Route path={ValidRoutes.NOTFOUND} element={<NotFound />} />

        <Route
          path={ValidRoutes.AVERAGES}
          element={
            <ProtectedRoute>
              <Averages />
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.UNITS}
          element={
            <ProtectedRoute>
              <Units />
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.COMBATSIMULATOR}
          element={
            <ProtectedRoute>
              <CombatSimulator />
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

