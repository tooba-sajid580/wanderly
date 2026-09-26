import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminRequests.css";

function AdminRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get("http://localhost:5000/api/requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data.requests);
      } catch (err) {
        setError("Could not load requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  async function handleRespond(requestId, status) {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.log("Could not respond to request");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2 className="page-heading">Trip requests</h2>
      <p className="page-subtext">Review ideas submitted by Wanderly travelers.</p>

      <div className="requests-table-card">
        <div className="requests-table-header">
          <span>Destination</span>
          <span>Traveler</span>
          <span>Preferred date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {requests.length === 0 ? (
          <p className="no-results">No pending requests.</p>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="requests-table-row">
              <span>{request.destinationRequest}</span>
              <span>{request.userId?.name}</span>
              <span>{request.preferredDate}</span>
              <span className="status-pending">Pending</span>
              <span className="request-actions">
                <button onClick={() => handleRespond(request._id, "approved")} className="btn-approve">Approve</button>
                <button onClick={() => handleRespond(request._id, "rejected")} className="btn-reject">Reject</button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminRequests;