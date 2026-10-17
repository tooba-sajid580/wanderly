import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/RequestTrip.css";

function RequestTrip() {
  const { token } = useAuth();
  const [destinationRequest, setDestinationRequest] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(
        "/api/requests",
        { destinationRequest, preferredDate, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Request submitted!");
      setDestinationRequest("");
      setPreferredDate("");
      setNotes("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit request");
    }
  };

  return (
    <div className="container">
      <h2 className="page-heading">Request a trip</h2>
      <p className="page-subtext">Tell us where you would love to go and what kind of experience you want.</p>

      <form onSubmit={handleSubmit} className="request-form-card">
        <h3>Share your idea</h3>
        <p className="request-form-subtext">We will review your request and use it to shape future trips.</p>

        <label>Destination idea</label>
        <input placeholder="e.g. Skardu" value={destinationRequest} onChange={(e) => setDestinationRequest(e.target.value)} />

        <label>Preferred dates</label>
        <input placeholder="e.g. Mid September" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />

        <label>Notes</label>
        <textarea placeholder="A lake trip, small group, relaxed pace..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>

        {message && <p className="join-message">{message}</p>}
        <button type="submit" className="create-trip-btn">Submit request</button>
      </form>
    </div>
  );
}

export default RequestTrip;