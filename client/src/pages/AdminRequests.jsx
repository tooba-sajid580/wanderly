import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminRequests.css";

function formatDate(value) {
  if (!value) return "Flexible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || !/\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AdminRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Please log in to view requests");
      setLoading(false);
      return;
    }

    async function fetchRequests() {
      try {
        const response = await axios.get("/api/requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data.requests || []);
      } catch (err) {
        setError("Could not load requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [token]);

  async function handleRespond(requestId, status) {
    setActionError("");
    setBusyId(requestId);
    try {
      const response = await axios.put(
        `/api/requests/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = { ...response.data.request, canRespond: true };
      setRequests((current) => current.map((r) => (r._id === requestId ? updated : r)));
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not respond to request");
      // Reload so the list shows who claimed it
      try {
        const refreshed = await axios.get("/api/requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(refreshed.data.requests || []);
      } catch {
        // keep the current list if the refresh fails too
      }
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2 className="page-heading">Trip requests</h2>
      <p className="page-subtext">
        Review ideas submitted by Wanderly travelers. The first organizer to respond takes the request.
      </p>

      {actionError && <p className="error-text">{actionError}</p>}

      <div className="requests-table-card">
        <div className="requests-table-header">
          <span>Destination</span>
          <span>Traveler</span>
          <span>Preferred date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {requests.length === 0 ? (
          <p className="no-results">No requests yet.</p>
        ) : (
          requests.map((request) => {
            const status = request.status || "pending";
            return (
              <div key={request._id} className="requests-table-row">
                <span>{request.destinationRequest}</span>
                <span>{request.userId?.name}</span>
                <span>{formatDate(request.preferredDate)}</span>
                <span className={`status-${status}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="request-actions">
                  {request.canRespond ? (
                    <>
                      <button
                        onClick={() => handleRespond(request._id, "approved")}
                        className="btn-approve"
                        disabled={busyId === request._id || status === "approved"}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRespond(request._id, "rejected")}
                        className="btn-reject"
                        disabled={busyId === request._id || status === "rejected"}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="handled-by">
                      Handled by {request.handledBy?.name || "another organizer"}
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminRequests;