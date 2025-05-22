import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      if (role === "Admin") navigate("/create-software", { replace: true });
      else if (role === "Manager") navigate("/pending-requests", { replace: true });
      else if (role === "Employee") navigate("/request-access", { replace: true });
    }
    else navigate("/login");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await axios.post("/auth/login", { email, password });
      if (res) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setMessage("User logged in successfully!");
   
        onLoginSuccess?.();
        if (res.data.role === "Admin") setTimeout(() => { navigate("/create-software", { replace: true }); }, 2000);
        else if (res.data.role === "Manager") setTimeout(() => { navigate("/pending-requests", { replace: true }); }, 2000);
        else if (res.data.role === "Employee") setTimeout(() => { navigate("/request-access", { replace: true }); }, 2000);
      }
    } catch (err: any) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="email">Email</label>
        <input
          className="login-input"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="login-button" type="submit">
          Login
        </button>
        <div style={{ textAlign: "center", paddingTop: "10px" }}>
          <p>{message}</p>
        </div>
      </form>
      <p className="login-link">
        New User? <Link to="/register">Click Here</Link>
      </p>
    </div>
  );
}
