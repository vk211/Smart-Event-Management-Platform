import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./Components/Authentication/Auth";
import Dashboard from "./Components/Dashboard/Dashboard";
import HomePage from "./Components/HomePage/Home";
import EventForm from "./Components/EventCreation/EventForm";
import ManageEvents from "./Components/ManageEvents/ManageEvents";
import Header from "./Components/Header";
import { getToken, getUserRole, isTokenValid } from "./Components/Authentication/helper";

function App() {
  const isAuthorized = (allowedRoles?: string[]) => {
    // Get fresh values on each authorization check
    const token = getToken();
    const role = getUserRole();
    const tokenValid = isTokenValid();
    
    console.log("Authorization check:", { token: !!token, role, tokenValid, allowedRoles });
    
    if (!token || !tokenValid) {
      console.log("Authorization failed: No valid token");
      return false;
    }
    
    if (allowedRoles && !allowedRoles.includes(role || "")) {
      console.log("Authorization failed: Role not allowed", { role, allowedRoles });
      return false;
    }
    
    console.log("Authorization successful");
    return true;
  };

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes with role-based access */}
        <Route
          path="/dashboard"
          element={
            isAuthorized(["ADMIN", "ORGANIZER", "ATTENDEE"]) ? (
              <Dashboard />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="/create-event"
          element={
            isAuthorized(["ADMIN", "ORGANIZER"]) ? (
              <EventForm />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="/manage-events"
          element={
            isAuthorized(["ADMIN"]) ? (
              <ManageEvents />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
