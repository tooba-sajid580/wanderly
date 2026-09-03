import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Trip requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>
            <p>{request.destinationRequest} — {request.preferredDate}</p>
            <p>From {request.userId?.name}: "{request.notes}"</p>
            <button onClick={() => handleRespond(request._id, "approved")}>Approve</button>
            <button onClick={() => handleRespond(request._id, "rejected")}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminRequests;