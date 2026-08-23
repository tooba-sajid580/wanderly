import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password: pwd });
      console.log("Success:", response.data);
      auth.login({ user: response.data.user, token: response.data.token });
      navigate("/trips");
    } catch (error) {
      setErr(error.response?.data?.message || "cannot login");
    }
  };

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <label>Password</label>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" />
        {err && <p style={{ color: "red" }}>{err}</p>}
        <button type="submit">Log in</button>
      </form>
      <p>New here? <a href="/register">Create an account</a></p>
    </div>
  );
}

export default Login;