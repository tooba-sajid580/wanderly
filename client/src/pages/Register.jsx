import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (pwd !== confirmPwd) {
      setErr("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        email, password: pwd, name, role
      });
      auth.login({ user: response.data.user, token: response.data.token });
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">Wanderly</div>
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="auth-subtext">Start discovering trips with Wanderly.</p>

        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

          <label>Email address</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

          <label>Password</label>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Create a password" />

          <label>Confirm password</label>
          <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Repeat your password" />

          <label>I want to</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Browse and join trips</option>
            <option value="admin">Organize and post trips</option>
          </select>

          {err && <p className="error-text">{err}</p>}

          <button type="submit" className="create-trip-btn auth-btn-primary">Create account</button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

export default Register;