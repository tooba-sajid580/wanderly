import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminTripForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const images = imagesInput.split(",").map((url) => url.trim()).filter((url) => url !== "");

    try {
      await axios.post(
        "http://localhost:5000/api/admin/trips",
        { title, destination, startDate, endDate, description, category, capacity, totalPrice, pricePerPerson, images, itinerary },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create trip");
    }
  };

  return (
    <div>
      <h2>Create trip</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Destination</label>
        <input value={destination} onChange={(e) => setDestination(e.target.value)} />

        <label>Start date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End date</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

        <label>Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />

        <label>Capacity</label>
        <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />

        <label>Total price</label>
        <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />

        <label>Price per person</label>
        <input type="number" value={pricePerPerson} onChange={(e) => setPricePerPerson(e.target.value)} />

        <label>Image URLs (comma-separated, up to 6)</label>
        <input value={imagesInput} onChange={(e) => setImagesInput(e.target.value)} placeholder="url1.jpg, url2.jpg" />

        <label>Itinerary</label>
        {itinerary.map((entry, index) => (
          <div key={index} className="itinerary-row">
            <input
              type="number"
              placeholder="Day"
              value={entry.day}
              onChange={(e) => updateDay(index, "day", e.target.value)}
            />
            <input
              placeholder="Place"
              value={entry.place}
              onChange={(e) => updateDay(index, "place", e.target.value)}
            />
            <input
              placeholder="Activities (e.g. drive to Hunza, lunch at local dhaba)"
              value={entry.activities}
              onChange={(e) => updateDay(index, "activities", e.target.value)}
            />
            <button type="button" onClick={() => removeDay(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addDay}>+ Add day</button>

        {error && <p>{error}</p>}
        <button type="submit">Save trip</button>
      </form>
    </div>
  );
}

export default AdminTripForm;