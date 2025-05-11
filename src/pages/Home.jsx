import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role) {
      if (role === "librarian") navigate("/admin");
      else navigate("/dashboard");
    }
  }, [role, loading]);
  

  return <p style={{ padding: "2rem" }}>Redirecting...</p>;
}
