import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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
        "http://localhost:5000/api/requests",
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
    <div>
      <h2>Request a trip</h2>
      <form onSubmit={handleSubmit}>
        <label>Destination idea</label>
        <input value={destinationRequest} onChange={(e) => setDestinationRequest(e.target.value)} placeholder="Skardu" />

        <label>Preferred dates</label>
        <input value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} placeholder="Mid September" />

        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="A lake trip, small group"></textarea>

        {message && <p>{message}</p>}
        <button type="submit">Submit request</button>
      </form>
    </div>
  );
}

export default RequestTrip;