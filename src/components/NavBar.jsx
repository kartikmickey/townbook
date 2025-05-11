import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={navStyle}>
      <h3 style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
        📖 TownBook
      </h3>
      <div>
        {role === "member" && (
          <button onClick={() => navigate("/dashboard")} style={btnStyle}>
            Dashboard
          </button>
        )}
        {role === "librarian" && (
          <button onClick={() => navigate("/admin")} style={btnStyle}>
            Admin
          </button>
        )}
        <button
          onClick={handleLogout}
          style={{ ...btnStyle, backgroundColor: "#dc3545" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const navStyle = {
  padding: "1rem 2rem",
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid #ccc",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const btnStyle = {
  marginLeft: "12px",
  padding: "8px 14px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
