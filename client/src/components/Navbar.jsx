import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Wanderly</Link>

      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {user && (
        <>
          <Link to="/trips">Browse Trips</Link>
          <Link to="/my-trips">My Trips</Link>
          <Link to="/request-trip">Request a Trip</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}

      {user && user.role === "admin" && (
        <>
          <Link to="/admin">My Posted Trips</Link>
          <Link to="/admin/requests">Requests</Link>
        </>
      )}

    </nav>
  );
}

export default Navbar;