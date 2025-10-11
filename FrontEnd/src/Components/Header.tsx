import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getToken, getUserRole, clearAuthData } from "./Authentication/helper";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();
  const role = getUserRole(); // Extract role from JWT

  const handleLogout = () => {
    clearAuthData();
    navigate("/auth", { replace: true });
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          🎟️ Event Management
        </Typography>

        <Box>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>

              {/* ORGANIZER & ADMIN: Can create events */}
              {(role === "ADMIN" || role === "ORGANIZER") && (
                <Button color="inherit" component={Link} to="/create-event">
                  Create Event
                </Button>
              )}

              {/* ADMIN ONLY: Full admin management panel */}
              {role === "ADMIN" && (
                <Button color="inherit" component={Link} to="/manage-events">
                  Admin Panel
                </Button>
              )}

              {/* ORGANIZER: Basic event management */}
              {role === "ORGANIZER" && (
                <Button color="inherit" component={Link} to="/dashboard">
                  My Events
                </Button>
              )}

              <Button color="inherit" onClick={handleLogout}>
                Logout ({role})
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/auth")}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
