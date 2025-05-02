import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Common.css";

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("Signup submitted:", formData);
    // TODO: Integrate with backend registration (e.g., https://x.ai/api)
  };

  return (
    <div className="page-container">
      <h1 className="top-margin">Sign Up</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-button">
          Sign Up
        </button>
      </form>
      <p className="form-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
