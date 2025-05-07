import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- added for toggle
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (email === "logith@gmail.com" && password === "logith123") {
      onLogin({ email });
      navigate("/chat");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ fontFamily: "Dancing Script, cursive" }}>
          Welcome to
          <span className="text-primary ms-3">Angloo Ai</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mt-2">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group mt-2">
            <label>Password</label>
            <div className="password-wrapper ">
              <input
                type={showPassword ? "text" : "password"} // <-- toggle type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
