import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Register";
import CreateSoftware from "./Components/CreateSoftware";
import RequestAccess from "./Components/RequestAccess";
import PendingRequests from "./Components/PendingRequests";
import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import axios from "./api/axios";
import LandingPage from "./Components/LandingPage";

function App() {
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setUser(null);
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.get("/auth/currentuser");
      // console.log(data);
      setUser(data.name); // Assuming response { username: string, ... }
    } catch (err: any) {
      console.error("Unauthorized:", err.response?.data || err.message);
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLoginSuccess={fetchUser} />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/create-software" element={<CreateSoftware />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
      </Routes>
    </>
  );
}

export default App;
