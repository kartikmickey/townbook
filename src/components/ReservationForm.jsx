import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ReservationForm({ type, item }) {
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const user = auth.currentUser;

  const handleReserve = async () => {
    if (!user) return;

    const q = query(
      collection(db, "reservations"),
      where("uid", "==", user.uid),
      where("itemId", "==", item.id),
      where("status", "in", ["pending", "approved"])
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      setMessage("⚠️ You already have an active reservation for this item.");
      return;
    }

    const reservation = {
      uid: user.uid,
      type,
      itemId: item.id,
      itemName: item.title || item.name,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    if (type === "room") {
      if (!timeSlot) {
        setMessage("⚠️ Please select a time slot.");
        return;
      }
      reservation.timeSlot = timeSlot;
    }

    try {
      await addDoc(collection(db, "reservations"), reservation);
      setMessage("✅ Reservation requested!");
      setTimeSlot("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to reserve. Please try again.");
    }
  };

  return (
    <div style={{ marginTop: "12px" }}>
      {type === "room" && (
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          style={{ padding: "6px", marginBottom: "8px", width: "70%" }}
        >
          <option value="">Select time</option>
          {item.timeSlots.map((slot, i) => (
            <option key={i} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={handleReserve}
        style={{
          marginLeft: type === "room" ? "1rem" : 0,
          padding: "6px 12px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Reserve
      </button>
      {message && (
        <p
          style={{
            marginTop: "8px",
            color: message.startsWith("✅")
              ? "green"
              : message.startsWith("⚠️")
              ? "orange"
              : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
