import { useEffect, useState } from "react";
import { db } from "../firebase";
import NavBar from "../components/NavBar";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import AddBookForm from "../components/AddBookForm";
import AddRoomForm from "../components/AddRoomForm";

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [returned, setReturned] = useState([]);

  const fetchReservations = async () => {
    const snap = await getDocs(collection(db, "reservations"));
    const list = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    setPending(list.filter((r) => r.status === "pending"));
    setReturned(list.filter((r) => r.checkedIn && !r.returned));
  };

  const handleUpdate = async (id, action) => {
    await updateDoc(doc(db, "reservations", id), {
      status: action,
    });
    setPending((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReturn = async (id) => {
    await updateDoc(doc(db, "reservations", id), {
      returned: true,
    });
    setReturned((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <>
      <NavBar />

      <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={cardStyle}>
          <h2>🛠️ Librarian Dashboard</h2>
          <AddBookForm />
          <AddRoomForm />
        </div>

        <div style={cardStyle}>
          <h3>📥 Pending Reservations</h3>
          {pending.length === 0 ? (
            <p>No pending reservations.</p>
          ) : (
            <ul style={{ padding: 0 }}>
              {pending.map((r) => (
                <li key={r.id} style={entryCard}>
                  <strong>{r.itemName}</strong> ({r.type})
                  {r.timeSlot && <div>⏰ {r.timeSlot}</div>}
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      onClick={() => handleUpdate(r.id, "approved")}
                      style={{ ...btnStyle, backgroundColor: "green" }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(r.id, "declined")}
                      style={{ ...btnStyle, backgroundColor: "red" }}
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={cardStyle}>
          <h3>📦 Pending Returns</h3>
          {returned.length === 0 ? (
            <p>No items to return.</p>
          ) : (
            <ul style={{ padding: 0 }}>
              {returned.map((r) => (
                <li key={r.id} style={entryCard}>
                  <strong>{r.itemName}</strong> ({r.type}) ✅ Checked In
                  {r.timeSlot && <div>⏰ {r.timeSlot}</div>}
                  <button
                    onClick={() => handleReturn(r.id)}
                    style={{
                      ...btnStyle,
                      backgroundColor: "#6c757d",
                      marginTop: "0.5rem",
                    }}
                  >
                    Mark as Returned
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

// 💠 Styles
const cardStyle = {
  background: "#fff",
  padding: "1.5rem",
  marginBottom: "2rem",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const entryCard = {
  background: "#f9f9f9",
  padding: "1rem",
  borderRadius: "6px",
  marginBottom: "1rem",
  listStyle: "none",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const btnStyle = {
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  marginRight: "0.5rem",
  fontWeight: "bold",
  cursor: "pointer",
};
