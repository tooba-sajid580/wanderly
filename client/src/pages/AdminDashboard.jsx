import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyPostedTrips() {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/trips/my-posted", {
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
      await axios.delete(`http://localhost:5000/api/admin/trips/${tripId}/permanent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete trip");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>My posted trips</h2>
      <Link to="/admin/create-trip">Create trip</Link>

      {trips.length === 0 ? (
        <p>You haven't posted any trips yet.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip._id}>
            <h3>{trip.title}</h3>
            <p>{trip.capacity} spots · {trip.status}</p>
            <Link to={`/admin/trips/${trip._id}/members`}>View members</Link>
            <Link to={`/admin/edit-trip/${trip._id}`}>Edit</Link>
            <button onClick={() => handleDelete(trip._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;