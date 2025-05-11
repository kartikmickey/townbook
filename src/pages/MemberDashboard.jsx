import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";

import BookList from "../components/BookList";
import RoomList from "../components/RoomList";
import NavBar from "../components/NavBar";
import { useNavigate, useLocation } from "react-router-dom";



export default function MemberDashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
const softRefresh = () => {
    navigate("/refresh", { replace: true }); // temporary route
    setTimeout(() => {
      navigate(location.pathname, { replace: true }); // back to original
    }, 50);
  };

  const fetchReservations = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "reservations"),
      where("uid", "==", user.uid)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    setReservations(data);
    setLoading(false);
  };

  const handleCheckIn = async (id, itemId, type) => {
    await updateDoc(doc(db, "reservations", id), {
      checkedIn: true,
    });

    if (type === "book") {
      await updateDoc(doc(db, "books", itemId), {
        copies: increment(-1),
      });
    }
    if (type === "room") {
      await updateDoc(doc(db, "rooms", itemId), {
        capacity: increment(-1),
      });
    }

    fetchReservations();
    // window.location.reload();
    softRefresh()
  };

  const handleReturn = async (id, itemId, type) => {
    await updateDoc(doc(db, "reservations", id), {
      returned: true,
    });

    if (type === "book") {
      await updateDoc(doc(db, "books", itemId), {
        copies: increment(1),
      });
    }
    if (type === "room") {
      await updateDoc(doc(db, "rooms", itemId), {
        capacity: increment(1),
      });
    }

    fetchReservations();
    // window.location.reload();
    softRefresh()
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <>
      <NavBar />
      <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={cardStyle}>
          <h2>📖 Browse Catalog</h2>
          <BookList />
          <RoomList />
        </div>

        <div style={cardStyle}>
          <h2>📋 My Reservations</h2>
          {loading ? (
            <p>Loading...</p>
          ) : reservations.length === 0 ? (
            <p style={{ color: "#666" }}>No reservations yet.</p>
          ) : (
            <ul style={{ padding: 0 }}>
              {reservations.map((r) => (
                <li key={r.id} style={entryCard}>
                  <strong>{r.itemName}</strong> ({r.type})
                  {r.timeSlot && <div>⏰ {r.timeSlot}</div>}
                  <div style={{ marginTop: "4px" }}>
                    Status:{" "}
                    <span style={getBadgeStyle(r.status)}>{r.status}</span>
                  </div>
                  {r.status === "approved" && !r.checkedIn && (
                    <div style={{ marginTop: "0.7rem" }}>
                      <p style={{ color: "#004085", marginBottom: "0.4rem" }}>
                        🔔 Reminder: Please check in.
                      </p>
                      <button
                        onClick={() => handleCheckIn(r.id, r.itemId, r.type)}
                        style={buttonStyle}
                      >
                        {r.type === "room" ? "Check In" : "Mark as Picked Up"}
                      </button>
                    </div>
                  )}
                  {r.checkedIn && !r.returned && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <p style={{ color: "green" }}>
                        ✅ {r.type === "room" ? "Checked In" : "Picked Up"}
                      </p>
                      <button
                        onClick={() => handleReturn(r.id, r.itemId, r.type)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: "#6c757d",
                          marginTop: "0.5rem",
                        }}
                      >
                        Return
                      </button>
                    </div>
                  )}
                  {r.returned && (
                    <p style={{ color: "#555", marginTop: "0.5rem" }}>
                      📦 Returned
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

// Style functions
const getBadgeStyle = (status) => {
  let bg = "#fff3cd",
    color = "#856404"; // default = pending
  if (status === "approved") {
    bg = "#d4edda";
    color = "#155724";
  } else if (status === "declined") {
    bg = "#f8d7da";
    color = "#721c24";
  }

  return {
    backgroundColor: bg,
    color: color,
    padding: "2px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
  };
};

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

const buttonStyle = {
  padding: "8px 14px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
