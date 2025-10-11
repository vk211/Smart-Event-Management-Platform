import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Block,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../Authentication/helper";

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
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  organizer: string;
  revenue: number;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  status: "ACTIVE" | "SUSPENDED";
  registeredEvents: number;
  joinedDate: string;
}

const mockEvents: Event[] = [
  
];

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Admin",
    email: "admin@test.com",
    role: "ADMIN",
    status: "ACTIVE",
    registeredEvents: 0,
    joinedDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Sarah Organizer",
    email: "organizer@test.com",
    role: "ORGANIZER",
    status: "ACTIVE",
    registeredEvents: 3,
    joinedDate: "2024-03-20"
  },
  {
    id: 3,
    name: "Mike Attendee",
    email: "attendee@test.com",
    role: "ATTENDEE",
    status: "ACTIVE",
    registeredEvents: 12,
    joinedDate: "2024-06-10"
  },
  {
    id: 4,
    name: "Test User",
    email: "test@test.com",
    role: "ATTENDEE",
    status: "SUSPENDED",
    registeredEvents: 5,
    joinedDate: "2024-08-05"
  }
];

const ManageEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; eventId: number | null }>({
    open: false,
    eventId: null
  });
  
  const navigate = useNavigate();
  const role = getUserRole();

  // Redirect if not admin
  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [role, navigate]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
           user.email.toLowerCase().includes(searchFilter.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "success";
      case "DRAFT": return "warning";
      case "CANCELLED": return "error";
      case "COMPLETED": return "info";
      default: return "default";
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    setDeleteDialog({ open: true, eventId });
  };

  const confirmDeleteEvent = () => {
    if (deleteDialog.eventId) {
      setEvents(events.filter(e => e.id !== deleteDialog.eventId));
      setDeleteDialog({ open: false, eventId: null });
    }
  };

  const handleChangeEventStatus = (eventId: number, newStatus: Event["status"]) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    ));
  };

  const handleUserStatusToggle = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
        : user
    ));
  };

  const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
  const totalRegistrations = events.reduce((sum, event) => sum + event.registrations, 0);
  const activeEvents = events.filter(e => e.status === "PUBLISHED").length;

  if (role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography variant="h6" color="error">
          Access denied. Admin privileges required.
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          🔧 Admin Management Panel
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

      {/* Overview Statistics */}
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
              {activeEvents}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Active Events
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md">
          <CardContent className="text-center">
            <Typography variant="h4" color="info.main" className="font-bold">
              {totalRegistrations.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Registrations
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md">
          <CardContent className="text-center">
            <Typography variant="h4" color="warning.main" className="font-bold">
              ${totalRevenue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Revenue
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Events and Users */}
      <Card className="rounded-xl shadow-md">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Events Management" />
            <Tab label="Users Management" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Events Management Tab */}
        {activeTab === 0 && (
          <CardContent>
            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <TextField
                placeholder="Search events, locations, organizers..."
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
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </TextField>
            </div>

            {/* Events Table */}
            <TableContainer component={Paper} className="rounded-xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Event Name</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Organizer</strong></TableCell>
                    <TableCell><strong>Registrations</strong></TableCell>
                    <TableCell><strong>Revenue</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <Typography variant="subtitle2" className="font-medium">
                            {event.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {event.location}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.organizer}</TableCell>
                      <TableCell>
                        {event.registrations}/{event.capacity}
                      </TableCell>
                      <TableCell>${event.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
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
                          {event.status === "PUBLISHED" && (
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleChangeEventStatus(event.id, "CANCELLED")}
                            >
                              <Block />
                            </IconButton>
                          )}
                          {event.status === "DRAFT" && (
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleChangeEventStatus(event.id, "PUBLISHED")}
                            >
                              <CheckCircle />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Users Management Tab */}
        {activeTab === 1 && (
          <CardContent>
            <div className="flex gap-4 mb-6">
              <TextField
                placeholder="Search users by name or email..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="flex-1"
              />
            </div>

            <TableContainer component={Paper} className="rounded-xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Events</strong></TableCell>
                    <TableCell><strong>Joined</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={user.role === "ADMIN" ? "error" : user.role === "ORGANIZER" ? "warning" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={user.status === "ACTIVE" ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.registeredEvents}</TableCell>
                      <TableCell>{user.joinedDate}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant={user.status === "ACTIVE" ? "outlined" : "contained"}
                          color={user.status === "ACTIVE" ? "error" : "success"}
                          onClick={() => handleUserStatusToggle(user.id)}
                        >
                          {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Analytics Tab */}
        {activeTab === 2 && (
          <CardContent>
            <Typography variant="h6" className="mb-4">
              📊 Platform Analytics
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Event Status Distribution
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Published:</span>
                    <span className="font-medium">{events.filter(e => e.status === "PUBLISHED").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft:</span>
                    <span className="font-medium">{events.filter(e => e.status === "DRAFT").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{events.filter(e => e.status === "COMPLETED").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled:</span>
                    <span className="font-medium">{events.filter(e => e.status === "CANCELLED").length}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <Typography variant="subtitle1" className="font-medium mb-2">
                  User Role Distribution
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Admins:</span>
                    <span className="font-medium">{users.filter(u => u.role === "ADMIN").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organizers:</span>
                    <span className="font-medium">{users.filter(u => u.role === "ORGANIZER").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attendees:</span>
                    <span className="font-medium">{users.filter(u => u.role === "ATTENDEE").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-medium">{users.filter(u => u.status === "ACTIVE").length}</span>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, eventId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this event? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, eventId: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteEvent} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageEvents;