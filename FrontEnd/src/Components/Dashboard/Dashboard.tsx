import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Visibility, People, CalendarToday } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getToken, getUserDetails } from "../Authentication/helper";

type Role = "ADMIN" | "ORGANIZER" | "ATTENDEE";

interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  location: string;
  capacity: number;
  registrations: number;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  organizer: string;
}

const mockEvents: Event[] = [
  // {
  //   id: 1,
  //   name: "Tech Conference 2025",
  //   description: "Annual technology conference featuring AI and blockchain",
  //   category: "Conference",
  //   date: "2025-11-15",
  //   location: "San Francisco, CA",
  //   capacity: 500,
  //   registrations: 342,
  //   price: 299,
  //   status: "PUBLISHED",
  //   organizer: "TechCorp"
  // },
  // {
  //   id: 2,
  //   name: "Music Festival",
  //   description: "3-day outdoor music festival with top artists",
  //   category: "Concert",
  //   date: "2025-12-01",
  //   location: "Los Angeles, CA",
  //   capacity: 2000,
  //   registrations: 1456,
  //   price: 150,
  //   status: "PUBLISHED",
  //   organizer: "MusicEvents"
  // },
  // {
  //   id: 3,
  //   name: "Startup Workshop",
  //   description: "Learn how to build and scale your startup",
  //   category: "Workshop",
  //   date: "2025-10-20",
  //   location: "New York, NY",
  //   capacity: 100,
  //   registrations: 23,
  //   price: 99,
  //   status: "DRAFT",
  //   organizer: "StartupHub"
  // }
];

const Dashboard: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [events] = useState<Event[]>(mockEvents);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try { 
        const token = getToken();
        if (token) {
          const userId = localStorage.getItem("userId") || "";
          const userData = await getUserDetails(token, userId);
          setRole(userData.roles?.[0] || null);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        // Clear invalid auth data and redirect to auth page
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/auth", { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "success";
      case "DRAFT": return "warning";
      case "CANCELLED": return "error";
      default: return "default";
    }
  };

  if (!role) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          📅 Event Management Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/create-event")}
          className="!rounded-xl"
        >
          Create New Event
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="rounded-xl shadow-md">
          <CardContent className="text-center">
            <Typography variant="h4" color="primary" className="font-bold">
              {events.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Events
            </Typography>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-md">
          <CardContent className="text-center">
            <Typography variant="h4" color="success.main" className="font-bold">
              {events.filter(e => e.status === "PUBLISHED").length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Published
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md">
          <CardContent className="text-center">
            <Typography variant="h4" color="warning.main" className="font-bold">
              {events.reduce((sum, e) => sum + e.registrations, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Registrations
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md">
          <CardContent className="text-center">
            <Typography variant="h4" color="info.main" className="font-bold">
              ${events.reduce((sum, e) => sum + (e.registrations * e.price), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Revenue
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <TextField
          placeholder="Search events..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="flex-1"
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="PUBLISHED">Published</MenuItem>
          <MenuItem value="DRAFT">Draft</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </TextField>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="flex justify-between items-start mb-3">
                <Typography variant="h6" className="font-semibold">
                  {event.name}
                </Typography>
                <Chip
                  label={event.status}
                  color={getStatusColor(event.status) as any}
                  size="small"
                />
              </div>

              <Typography variant="body2" color="textSecondary" className="mb-3">
                {event.description}
              </Typography>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarToday fontSize="small" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <People fontSize="small" />
                  {event.registrations}/{event.capacity} registered
                </div>
                <div className="text-sm font-medium text-green-600">
                  ${event.price} per ticket
                </div>
              </div>

              <div className="flex gap-2">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => console.log("View event", event.id)}
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => console.log("Edit event", event.id)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => console.log("Delete event", event.id)}
                >
                  <Delete />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="h6" color="textSecondary">
            No events found matching your criteria
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
