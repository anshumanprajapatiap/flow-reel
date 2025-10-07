import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("flowreel_user");
  return user ? children : <Navigate to="/login" />;
}
