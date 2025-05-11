import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LibrarianRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={loadingStyle}>
        <p>Loading librarian access...</p>
      </div>
    );
  }

  if (!user || role !== "librarian") {
    return <Navigate to="/" replace />;
  }

  return children;
}

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
  fontSize: "1.1rem",
  color: "#555",
};
