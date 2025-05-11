import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ReservationForm from "./ReservationForm";

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const snap = await getDocs(collection(db, "books"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(list);
    };
    fetchBooks();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📚 Available Books</h3>
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {books.map((book) => {
            const isOutOfStock = book.copies <= 0;
            return (
              <li
                key={book.id}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: isOutOfStock ? "#f0f0f0" : "#fff",
                  opacity: isOutOfStock ? 0.6 : 1,
                }}
              >
                <div>
                  <strong style={{ fontSize: "1.1rem" }}>{book.title}</strong>
                  <br />
                  <span style={{ color: "#555" }}>by {book.author}</span>
                </div>
                <div style={{ marginTop: "6px" }}>
                  Copies:{" "}
                  <span style={{ fontWeight: "bold" }}>{book.copies}</span>
                </div>
                {!isOutOfStock ? (
                  <ReservationForm type="book" item={book} />
                ) : (
                  <p style={{ color: "red", marginTop: "0.5rem" }}>
                    ⚠️ No copies left
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
