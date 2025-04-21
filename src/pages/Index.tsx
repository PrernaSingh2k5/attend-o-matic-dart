import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // If user is authenticated, redirect to their dashboard
  if (user) {
    return user.role === "teacher" ? (
      <Navigate to="/teacher" />
    ) : (
      <Navigate to="/student" />
    );
  }
  
  // Otherwise redirect to login
  return <Navigate to="/login" />;
};

export default Index;
