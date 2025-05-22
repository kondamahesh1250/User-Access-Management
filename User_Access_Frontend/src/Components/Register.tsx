import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: ""
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
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = formData;
    try {
      let res = await axios.post("/auth/signup", { name, email, password });
      setMessage(res.data.message);
      if (res) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSignup} className="register-form">
        <label htmlFor="name">Name</label>
        <input
          className="register-input"
          placeholder="Enter Name"
          value={formData.name}
          name="name"
          onChange={handleChange}
          required
        /> <br />
        <label htmlFor="email">Email</label>
        <input
          className="register-input"
          placeholder="Enter Email"
          value={formData.email}
          name="email"
          onChange={handleChange}
          required
        /> <br />
        <label htmlFor="password">Password</label>
        <input
          className="register-input"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        /> <br />
        <label htmlFor="cpassword">Confirm Password</label>
        <input
          className="register-input"
          placeholder="Confirm Password"
          type="password"
          name="cpassword"
          value={formData.cpassword}
          onChange={handleChange}
          required
        />
        <button className="register-button" type="submit">Signup</button>
        <div style={{ textAlign: "center", paddingTop: "10px" }}>
          <p>{message}</p>
        </div>
      </form>
    </div>
  );
}
