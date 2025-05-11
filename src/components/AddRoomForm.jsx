import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddRoomForm() {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [slots, setSlots] = useState("");

  const handleAdd = async () => {
    const timeSlots = slots.split(",").map((s) => s.trim());

    await addDoc(collection(db, "rooms"), {
      name,
      capacity: parseInt(capacity),
      timeSlots,
    });

    alert("✅ Room added!");
    setName("");
    setCapacity(1);
    setSlots("");
  };

  return (
    <div style={cardStyle}>
      <h4 style={{ marginBottom: "1rem" }}>➕ Add New Room</h4>

      <label style={labelStyle}>Room Name:</label>
      <input
        placeholder="e.g. Study Room A"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Capacity:</label>
      <input
        type="number"
        min="1"
        placeholder="e.g. 5"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Time Slots (comma-separated):</label>
      <textarea
        placeholder="e.g. 9:00–10:00, 10:00–11:00"
        value={slots}
        onChange={(e) => setSlots(e.target.value)}
        rows={3}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <button onClick={handleAdd} style={buttonStyle}>
        Add Room
      </button>
    </div>
  );
}

// 🖌️ Styles
const cardStyle = {
  marginBottom: "2rem",
  padding: "1.5rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#fdfdfd",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  maxWidth: "500px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "1rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: "4px",
  display: "block",
};

const buttonStyle = {
  padding: "10px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
