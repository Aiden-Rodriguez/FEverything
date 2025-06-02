import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import NavBar from "./components/NavBar.tsx";
import Averages from "./pages/Averages.tsx";
import Units from "./pages/Units.tsx";
import CombatSimulator from "./pages/CombatSimulator.tsx";
import GamePage from "./pages/GamePage.tsx";
import About from "./pages/About.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import { ValidRoutes } from "../../backend/src/shared/validRoutes.ts"

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path={ValidRoutes.HOME} element={<Home />} />
        <Route path={ValidRoutes.ABOUT} element={<About />} />
        <Route path={ValidRoutes.LOGIN} element={<Login />} />
        <Route path={ValidRoutes.SIGNUP} element={<Signup />} />
        <Route path={ValidRoutes.AVERAGES} element={<Averages />} />
        <Route path={ValidRoutes.UNITS} element={<Units />} />
        <Route path={ValidRoutes.COMBATSIMULATOR} element={<CombatSimulator />} />
        <Route path={ValidRoutes.GAMEPAGE} element={<GamePage />} />
        <Route path={ValidRoutes.NOTFOUND} element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
