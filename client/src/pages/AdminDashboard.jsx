import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyPostedTrips() {
      try {
        const response = await axios.get("/api/admin/trips/my-posted", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(response.data.trips);
      } catch (err) {
        setError("Could not load your trips");
      } finally {
        setLoading(false);
      }
    }
    fetchMyPostedTrips();
  }, []);

  async function handleDelete(tripId) {
    const confirmed = window.confirm("Are you sure you want to delete this trip? This cannot be undone.");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/admin/trips/${tripId}/permanent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete trip");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="admin-header">
        <div>
          <h2 className="page-heading">My posted trips</h2>
          <p className="page-subtext">Manage the adventures you created and the travelers joining them.</p>
        </div>
        <Link to="/admin/create-trip" className="create-trip-btn">Create trip</Link>
      </div>

      {trips.length === 0 ? (
        <p>You haven't posted any trips yet.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip._id} className="admin-row">
            <div className="admin-row-thumb">
              {trip.images?.[0] ? <img src={trip.images[0]} alt={trip.title} /> : "Travel photo"}
            </div>

            <div className="admin-row-info">
              <h3>{trip.title}</h3>
              <p className="admin-row-meta">{trip.capacity} spots · {trip.status}</p>
              {trip.joinedCount > 0 && <p className="popular-tag">Popular trip</p>}
            </div>

            <div className="admin-row-actions">
              <Link to={`/admin/trips/${trip._id}/members`} className="btn-outline">View members</Link>
              <Link to={`/admin/edit-trip/${trip._id}`} className="btn-outline">Edit</Link>
              <button onClick={() => handleDelete(trip._id)} className="btn-outline btn-danger">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;