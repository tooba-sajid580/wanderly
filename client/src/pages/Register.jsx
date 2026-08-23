import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [role,setRole]= useState("");

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", { email, password: pwd, name,role });
      console.log("Success:", response.data);
      auth.login({ user: response.data.user, token: response.data.token });
      navigate("/trips");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <label>Password</label>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" />
        <label>Role</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        {err && <p style={{ color: "red" }}>{err}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
  );
}

export default Register;