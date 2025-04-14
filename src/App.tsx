import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import NavBar from "./components/NavBar.tsx";

function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/game" element={<GodotGame />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/projects" element={<Projects />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
