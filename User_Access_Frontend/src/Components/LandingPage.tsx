import { Link } from "react-router-dom";
import "../App.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to User Access Management</h1>
      <p className="landing-description">
        Securely manage user roles, permissions, and access requests all in one place.
      </p>
      <div className="landing-button-group">
        <Link to="/login" className="landing-button">
          Login
        </Link>
        <Link to="/register" className="landing-button">
          Register
        </Link>
      </div>
    </div>
  );
}
