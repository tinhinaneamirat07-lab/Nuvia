import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    checkAuthStatus();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener("storage", checkAuthStatus);
    
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <h1 className="logo">Nuvia</h1>

      <div className="links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <a href="#recipes">Recipes</a>
        <Link
          to="/explore"
          className={location.pathname === "/explore" ? "active" : ""}
        >
          Explore
        </Link>
        <Link
          to="/profile"
          className={location.pathname === "/profile" ? "active" : ""}
        >
          Profile
        </Link>
      </div>

      {isLoggedIn ? (
        <button onClick={handleLogout} className="cta">
          Logout
        </button>
      ) : (
        <Link to="/login" className="cta">
          Login / Register
        </Link>
      )}
    </nav>
  );
}