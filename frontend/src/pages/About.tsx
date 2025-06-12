// import React from "react";
import "../styles/Common.css";

const About = () => {
  return (
    <div className="page-container">
      <h1 className="top-margin">About</h1>
      <div className="about-content">
        <p>
          Welcome to FEverything, a universal tool designed to help players plan
          or manage their Fire Emblem playthroughs.
        </p>
        <ul>
          <li>Track unit stats, growth rates, and stat caps.</li>
          <li>Customize units with different classes and attributes.</li>
          <li>View detailed stat averages for your selected routes.</li>
          <li>
            Simulate and plan in-game combat, and check sucess rates of combat.
          </li>
        </ul>
        <h3>Copyright</h3>
        <p>FEverything is in no way affiliated with Nintendo or Intelligent Systems. All official aspects of the Fire Emblem series are copyright 1990-2025 by Nintendo and Intelligent Systems.</p>
        <h3>Privacy Policy</h3>
        <p>To create an account, the user must provide a username and password. Passwords are encrypted and hashed, meaning they are transformed into a secure, unreadable format using cryptographic algorithms. This ensures that even if the database is compromised, the original passwords cannot be easily recovered or misused.</p>
        <br />
        <p>Contact the developer at a.woodenrod@gmail.com</p>
      </div>
    </div>
  );
};

export default About;
