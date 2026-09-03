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
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;