import React, { useState } from "react";
import api from "../api";

export default function AuthPage({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const response = await api.post("/auth/register", {
          name,
          email,
          password,
          role,
        });
        const { user, token } = response.data;
        onAuthSuccess({ user, token });
      } else {
        const response = await api.post("/auth/login", {
          email,
          password,
        });
        const { user, token } = response.data;
        onAuthSuccess({ user, token });
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message ||
          (isRegister ? "Registration failed. Try again." : "Invalid credentials")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoRole) => {
    setError("");
    if (demoRole === "manager") {
      setEmail("manager@example.com");
      setPassword("password123");
      setName("Alex Manager");
      setRole("manager");
    } else if (demoRole === "admin") {
      setEmail("admin@example.com");
      setPassword("password123");
      setName("Admin User");
      setRole("admin");
    } else {
      setEmail("sarthak@example.com");
      setPassword("password123");
      setName("Sarthak Mhatre");
      setRole("sales");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-scale-up">
        <div className="brand-header">
          <div className="logo">
            Sales<span>Hub</span>
          </div>
          <span className="platform-tag">Enterprise CRM</span>
        </div>

        <div className="auth-tab-group">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
          >
            Create Account
          </button>
        </div>

        <div className="auth-heading">
          <h2>{isRegister ? "Create your CRM account" : "Welcome back"}</h2>
          <p>
            {isRegister
              ? "Join SalesHub to manage pipeline, leads and team performance"
              : "Sign in to access your deals, leads, and real-time sales pipeline"}
          </p>
        </div>

        {error && <div className="login-error animate-fade-in">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sarthak Mhatre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="sarthak@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="custom-select"
              >
                <option value="sales">Sales Representative</option>
                <option value="manager">Sales Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="login-button btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner">Loading...</span>
            ) : isRegister ? (
              "Complete Registration"
            ) : (
              "Sign In to SalesHub"
            )}
          </button>
        </form>

        <div className="demo-credentials-box">
          <small className="demo-title">Quick Demo Login / Test Presets:</small>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill("sales")}
            >
              Sales Rep
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill("manager")}
            >
              Manager
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill("admin")}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
