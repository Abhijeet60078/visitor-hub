import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    const isAuthenticated = localStorage.getItem("authToken");
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default Index;
