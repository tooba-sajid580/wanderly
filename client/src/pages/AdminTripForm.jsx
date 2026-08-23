function AdminTripForm() {
  return (
    <div>
      <h2>Create trip</h2>
      <form>
        <label>Title</label><input />
        <label>Destination</label><input />
        <label>Start date</label><input type="date" />
        <label>End date</label><input type="date" />
        <label>Description</label><textarea></textarea>
        <label>Category</label><input />
        <label>Capacity</label><input type="number" />
        <label>Total price</label><input type="number" />
        <label>Price per person</label><input type="number" />
        <label>Image URLs (up to 6)</label><input />
        <button type="submit">Save trip</button>
      </form>
    </div>
  );
}
export default AdminTripForm;