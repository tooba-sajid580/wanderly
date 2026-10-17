import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const response = await axios.post("/api/auth/login", { email, password: pwd });
      auth.login({ user: response.data.user, token: response.data.token });
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Could not log in");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">Wanderly</div>
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtext">Log in to continue your journey.</p>

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

          <label>Password</label>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" />

          {err && <p className="error-text">{err}</p>}

          <button type="submit" className="create-trip-btn auth-btn-primary">Log in</button>
        </form>

        <div className="auth-divider">OR</div>

        <Link to="/register" className="auth-btn-secondary">Create an account</Link>
      </div>
    </div>
  );
}

export default Login;