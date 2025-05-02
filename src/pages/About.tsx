import React from "react";
import "../styles/Common.css";

const About = () => {
  return (
    <div className="page-container">
      <h1 className="top-margin">About</h1>
      <div className="about-content">
        <p>
          Welcome to the FEverything, universal tool designed to help players
          plan or manage their Fire Emblem playthroughs.
        </p>
        <p>With this application, you can:</p>
        <ul>
          <li>Track unit stats, growth rates, and stat caps.</li>
          <li>Customize units with different classes and attributes.</li>
          <li>View detailed stat averages for your selected routes.</li>
          <li>
            Simulate and plan in-game combat, and check sucess rates of combat.
          </li>
        </ul>
        <p>Contact a developer at a.woodenrod@gmail.com</p>
      </div>
    </div>
  );
};

export default About;
