import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState(1);

  const handleAdd = async () => {
    await addDoc(collection(db, "books"), {
      title,
      author,
      copies: parseInt(copies),
    });
    alert("✅ Book added!");
    setTitle("");
    setAuthor("");
    setCopies(1);
  };

  return (
    <div style={cardStyle}>
      <h4 style={{ marginBottom: "1rem" }}>📚 Add New Book</h4>

      <label style={labelStyle}>Title:</label>
      <input
        placeholder="e.g. Atomic Habits"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Author:</label>
      <input
        placeholder="e.g. James Clear"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Copies:</label>
      <input
        type="number"
        min="1"
        placeholder="e.g. 3"
        value={copies}
        onChange={(e) => setCopies(e.target.value)}
        style={inputStyle}
      />

      <button onClick={handleAdd} style={buttonStyle}>
        Add Book
      </button>
    </div>
  );
}

// 🎨 Shared Styles
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
