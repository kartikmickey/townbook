import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ReservationForm from "./ReservationForm";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const snap = await getDocs(collection(db, "rooms"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(list);
    };
    fetchRooms();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>🪑 Reading Rooms</h3>
      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {rooms.map(room => (
            <li
              key={room.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div>
                <strong style={{ fontSize: "1.1rem" }}>{room.name}</strong>
                <br />
                <span style={{ color: "#555" }}>Capacity: {room.capacity}</span>
              </div>

              <div style={{ marginTop: "6px" }}>
                <div style={{ fontWeight: "bold" }}>Time Slots:</div>
                {room.timeSlots && room.timeSlots.length > 0 ? (
                  <div style={{ marginTop: "0.4rem", marginBottom: "0.5rem" }}>
                    {room.timeSlots.map((slot, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          backgroundColor: "#e6f7ff",
                          borderRadius: "4px",
                          marginRight: "6px",
                          marginBottom: "4px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "red" }}>No available slots</p>
                )}
              </div>

              <ReservationForm type="room" item={room} />
            </li>
          ))}
        </ul>
      )}
      {/* <strong>{room.name}</strong> – Available Slots: {room.capacity} */}

    </div>
  );
}
