import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminTripMembers() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/trips/${tripId}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembers(response.data.members);
      } catch (err) {
        setError("Could not load members");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [tripId]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Members</h2>
      {members.length === 0 ? (
        <p>Nobody has joined this trip yet.</p>
      ) : (
        members.map((member) => (
          <div key={member._id}>
            <p>{member.userId?.name} — {member.userId?.email}</p>
            <p>{member.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminTripMembers;