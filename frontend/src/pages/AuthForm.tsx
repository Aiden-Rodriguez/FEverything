import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface AuthFormData {
  username: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname === "/Register";
  const [formData, setFormData] = useState<AuthFormData>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setHelperMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message?.type !== "error") {
      setHelperMessage({ type: "success", text: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && formData.password !== formData.confirmPassword) {
      setHelperMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = {
        username: formData.username,
        password: formData.password,
      };

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage =
          typeof data.message === "string"
            ? data.message
            : "Authentication failed";
        setHelperMessage({ type: "error", text: errorMessage });
        return;
      }

      // Store JWT token
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("login"));
      //console.log(`${isRegister ? "Registration" : "Login"} successful:`, data.token);

      setHelperMessage({
        type: "success",
        text: `${isRegister ? "Registration" : "Login"} successful`,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Auth error:", err);
      setHelperMessage({
        type: "error",
        text: "Server Error. Please try again later",
      });
    }
  };

  useEffect(() => {
    const expiredFlag = sessionStorage.getItem("sessionExpired");
    if (expiredFlag === "true") {
      console.log("Expiry message")
      setHelperMessage({
        type: "error",
        text: "Session expired. Please log in again.",
      });
      sessionStorage.removeItem("sessionExpired");
    }
  }, []);
  
  
  
  return (
    <div>
      <div>
        <h1>{isRegister ? "Register" : "Login"}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {isRegister && (
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {message && (
            <p
              className={
                message.type === "error" ? "error-message" : "success-message"
              }
            >
              {message.text}
            </p>
          )}
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link to={isRegister ? "/Login" : "/Register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
