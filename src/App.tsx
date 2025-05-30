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
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/:gameId/Averages" element={<Averages />} />
        <Route path="/:gameId/Units" element={<Units />} />
        <Route path="/:gameId/CombatSimulator" element={<CombatSimulator />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
