import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminTripForm.css";

function AdminTripForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { tripId } = useParams();
  const isEditMode = Boolean(tripId);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;
    async function fetchTrip() {
      try {
        const response = await axios.get(`http://localhost:5000/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const trip = response.data;
        setTitle(trip.title || "");
        setDestination(trip.destination || "");
        setStartDate(trip.startDate ? trip.startDate.slice(0, 10) : "");
        setEndDate(trip.endDate ? trip.endDate.slice(0, 10) : "");
        setDescription(trip.description || "");
        setCategory(trip.category || "");
        setCapacity(trip.capacity || "");
        setPricePerPerson(trip.pricePerPerson || "");
        setImagesInput((trip.images || []).join(", "));
        setItinerary(trip.itinerary || []);
      } catch (err) {
        setError("Could not load trip for editing");
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId, isEditMode, token]);

  function addDay() {
    setItinerary([...itinerary, { day: itinerary.length + 1, place: "", activities: "" }]);
  }
  function updateDay(index, field, value) {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  }
  function removeDay(index) {
    setItinerary(itinerary.filter((_, i) => i !== index));
  }

  const totalPrice = Number(pricePerPerson) * Number(capacity) || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const images = imagesInput.split(",").map((url) => url.trim()).filter((url) => url !== "");
    const tripData = {
      title,
      destination,
      startDate,
      endDate,
      description,
      category,
      capacity: Number(capacity),
      pricePerPerson: Number(pricePerPerson),
      images,
      itinerary: itinerary.map((d) => ({ ...d, day: Number(d.day) }))
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/admin/trips/${tripId}`, tripData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:5000/api/admin/trips", tripData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Could not save trip");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2 className="page-heading">{isEditMode ? "Edit trip" : "Create a trip"}</h2>
      <p className="page-subtext">
        {isEditMode ? "Update the details of your posted adventure." : "Share a new adventure with the Wanderly community."}
      </p>

      <form onSubmit={handleSubmit} className="trip-form-card">
        <div className="form-grid">
          <div>
            <label>Trip title</label>
            <input placeholder="e.g. Hunza Valley Adventure" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Destination (city, used for weather)</label>
            <input placeholder="e.g. Skardu" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>

          <div>
            <label>Start date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label>End date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div>
            <label>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <label>Capacity</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>

          <div>
            <label>Price per person</label>
            <input type="number" value={pricePerPerson} onChange={(e) => setPricePerPerson(e.target.value)} />
          </div>
          <div>
            <label>Total price (calculated)</label>
            <input type="number" value={totalPrice} readOnly />
          </div>

          <div>
            <label>Image URL(s), comma-separated</label>
            <input value={imagesInput} onChange={(e) => setImagesInput(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell travelers what makes this trip special..."></textarea>
          </div>

          <div className="form-full">
            <label>Itinerary</label>
            {itinerary.map((entry, index) => (
              <div key={index} className="itinerary-row">
                <input type="number" placeholder="Day" value={entry.day} onChange={(e) => updateDay(index, "day", e.target.value)} />
                <input placeholder="Place" value={entry.place} onChange={(e) => updateDay(index, "place", e.target.value)} />
                <input placeholder="Activities" value={entry.activities} onChange={(e) => updateDay(index, "activities", e.target.value)} />
                <button type="button" onClick={() => removeDay(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addDay} className="btn-outline">+ Add day</button>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="create-trip-btn">{isEditMode ? "Save changes" : "Create trip"}</button>
      </form>
    </div>
  );
}

export default AdminTripForm;