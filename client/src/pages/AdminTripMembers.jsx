import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminTripMembers.css";

function AdminTripMembers() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios.get(
          `/api/admin/trips/${tripId}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data);
      } catch (err) {
        setError("Could not load members");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [tripId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2 className="page-heading">Trip members</h2>
      <p className="page-subtext">{data.trip.title} · {data.trip.capacity} spots</p>

      <div className="members-stat-bar">
        <div><span className="stat-number">{data.joinedCount}</span> members joined</div>
        <div><span className="stat-number">{data.spotsRemaining}</span> spots remaining</div>
      </div>

      <div className="members-table-card">
        <div className="members-table-header">
          <span>Traveler</span>
          <span>Email</span>
          <span>Status</span>
          <span>Joined</span>
        </div>
        {data.members.length === 0 ? (
          <p className="no-results">Nobody has joined this trip yet.</p>
        ) : (
          data.members.map((member) => (
            <div key={member._id} className="members-table-row">
              <span>{member.userId?.name}</span>
              <span>{member.userId?.email}</span>
              <span className={`status-text status-${member.status}`}>{member.status}</span>
              <span>{new Date(member.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminTripMembers;