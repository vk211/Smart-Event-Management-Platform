import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

type Role = "ADMIN" | "ORGANIZER" | "ATTENDEE";

const Dashboard: React.FC = () => {
  // TODO: fetch from backend / JWT claims
  const [role] = useState<Role>("ORGANIZER"); // change to test different roles

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        {role} Dashboard
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* --- ADMIN DASHBOARD --- */}
        {role === "ADMIN" && (
          <>
            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">👥 Manage Users</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  View, edit, or deactivate users
                </Typography>
                <Button variant="contained" fullWidth>
                  Go to Users
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">📅 Manage Events</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Approve, reject, or delete events
                </Typography>
                <Button variant="contained" fullWidth>
                  Go to Events
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">📊 Analytics</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Track total events, attendees & revenue
                </Typography>
                <Button variant="contained" fullWidth>
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">📝 System Logs</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Monitor activities & logs
                </Typography>
                <Button variant="contained" fullWidth>
                  View Logs
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* --- ORGANIZER DASHBOARD --- */}
        {role === "ORGANIZER" && (
          <>
            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">📅 My Events</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Manage and edit your created events
                </Typography>
                <Button variant="contained" fullWidth>
                  View Events
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">👥 Registration Stats</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Attendees per event, charts & trends
                </Typography>
                <Button variant="contained" fullWidth>
                  View Stats
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">💰 Revenue Tracking</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Monitor revenue from paid events
                </Typography>
                <Button variant="contained" fullWidth>
                  View Revenue
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">⭐ Feedback</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Read reviews & feedback from attendees
                </Typography>
                <Button variant="contained" fullWidth>
                  View Feedback
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* --- ATTENDEE DASHBOARD --- */}
        {role === "ATTENDEE" && (
          <>
            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">🎟️ My Tickets</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  View upcoming & past events
                </Typography>
                <Button variant="contained" fullWidth>
                  View Tickets
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">⏰ Event Reminders</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Sync with your calendar
                </Typography>
                <Button variant="contained" fullWidth>
                  Set Reminders
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6">⭐ Give Feedback</Typography>
                <Typography className="text-sm text-gray-600 mb-4">
                  Rate & review events you attended
                </Typography>
                <Button variant="contained" fullWidth>
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
