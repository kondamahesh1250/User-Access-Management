import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

type NavbarProps = {
  user: string | null;
  onLogout: () => void;
};

function Navbar({ user, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
  };

  // console.log(user)

  return (
    <nav className="navbar">
      <div >
        <Link to="/" onClick={() => setMenuOpen(false)} className="navbar-brand">
          User Access Management
        </Link>
      </div>

      <div
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`navbar-links ${menuOpen ? "show" : ""}`}>
        {user ? (
          <>
            <span className="navbar-user">👤{user}</span>
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
