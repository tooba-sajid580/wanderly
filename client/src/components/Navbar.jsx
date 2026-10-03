import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const onAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Wanderly</Link>

      <div className="nav-links">
        {!user && !onAuthPage && (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="nav-register">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/">Home</Link>
            <Link to="/trips">Browse Trips</Link>
            <Link to="/my-trips">My Trips</Link>
            <Link to="/request-trip">Request a Trip</Link>

            {user.role === "admin" && (
              <>
                <Link to="/admin">My Posted Trips</Link>
                <Link to="/admin/requests">Requests</Link>
              </>
            )}

            <button onClick={logout} className="nav-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;