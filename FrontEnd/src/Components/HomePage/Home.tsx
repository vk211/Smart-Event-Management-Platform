import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Slider,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Box,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  FilterList,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Person,
  Star,
  FavoriteOutlined,
  Refresh,
} from "@mui/icons-material";
import { getToken, getUserRole, fetchEvents } from "../Authentication/helper";
import cardImage from "../../assets/card.jpg";

interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  location: string;
  price: number;
  image?: string;
  organizer?: string;
  rating?: number;
  attendees?: number;
  tags?: string[];
  // Additional fields that might come from backend
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  capacity?: number;
}

const HomePage: React.FC = () => {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [purchaseDialog, setPurchaseDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  
  const navigate = useNavigate();
  const token = getToken();
  const userRole = getUserRole();

  // Fetch events from backend
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eventsData = await fetchEvents();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Update price range when events are loaded
  useEffect(() => {
    if (events.length > 0) {
      const maxPrice = Math.max(...events.map(event => event.price || 0));
      if (maxPrice > priceRange[1]) {
        setPriceRange([0, Math.ceil(maxPrice / 100) * 100]); // Round up to nearest 100
      }
    }
  }, [events]);

  const filteredEvents = events.filter(
    (event: Event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? event.category === category : true) &&
      event.price >= priceRange[0] &&
      event.price <= priceRange[1]
  );

  const handlePurchase = (event: Event) => {
    if (!token) {
      navigate("/auth");
      return;
    }
    
    if (userRole === "ATTENDEE" || userRole === "ADMIN") {
      setSelectedEvent(event);
      setPurchaseDialog(true);
    } else {
      alert("Only attendees can purchase tickets.");
    }
  };

  const handleConfirmPurchase = () => {
    if (selectedEvent) {
      // Handle the purchase logic here
      const totalPrice = selectedEvent.price * ticketQuantity;
      alert(`Purchase confirmed! ${ticketQuantity} ticket(s) for "${selectedEvent.name}" - Total: $${totalPrice}`);
      setPurchaseDialog(false);
      setSelectedEvent(null);
      setTicketQuantity(1);
    }
  };

  const handleClosePurchaseDialog = () => {
    setPurchaseDialog(false);
    setSelectedEvent(null);
    setTicketQuantity(1);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-16 text-center">
          <Typography variant="h2" className="font-bold mb-4 drop-shadow-lg">
            🎟️ Discover Amazing Events
          </Typography>
          <Typography variant="h5" className="mb-8 opacity-90 max-w-2xl mx-auto">
            Find and book tickets for conferences, concerts, workshops & more
          </Typography>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>{events.length}+ Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>{events.reduce((sum: number, e: Event) => sum + (e.attendees || 0), 0).toLocaleString()}+ Attendees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Enhanced Search & Filters */}
        <Card className="rounded-2xl shadow-xl mb-6 overflow-hidden">
          <CardContent className="p-8">
            <Box className="flex items-center gap-2 mb-6">
              <Search className="text-indigo-600" />
              <Typography variant="h6" className="font-semibold text-gray-800">
                Find Your Perfect Event
              </Typography>
            </Box>
            
            <div className="grid gap-6 md:grid-cols-4">
              <TextField
                label="Search Events"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location..."
                variant="outlined"
                className="rounded-xl"
                InputProps={{
                  startAdornment: <Search className="mr-2 text-gray-400" fontSize="small" />
                }}
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  startAdornment={<FilterList className="mr-2 text-gray-400" fontSize="small" />}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Conference">Conference</MenuItem>
                  <MenuItem value="Concert">Concert</MenuItem>
                  <MenuItem value="Workshop">Workshop</MenuItem>
                  <MenuItem value="Exhibition">Exhibition</MenuItem>
                  <MenuItem value="Festival">Festival</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom className="font-medium text-gray-700 flex items-center gap-2">
                  <AttachMoney fontSize="small" />
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={Math.max(500, Math.max(...events.map(event => event.price || 0)))}
                  className="mt-2"
                />
              </Box>

              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort By</InputLabel>
                <Select defaultValue="" label="Sort By">
                  <MenuItem value="date">📅 Date</MenuItem>
                  <MenuItem value="price">💰 Price</MenuItem>
                  <MenuItem value="rating">⭐ Rating</MenuItem>
                  <MenuItem value="popularity">🔥 Popular</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Events Grid */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" className="font-bold text-gray-800 flex items-center gap-2">
              <CalendarToday className="text-indigo-600" />
              Featured Events ({filteredEvents.length})
            </Typography>
            <Button
              startIcon={<Refresh />}
              onClick={loadEvents}
              disabled={loading}
              variant="outlined"
              size="small"
              className="!rounded-xl"
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <CircularProgress size={40} />
              <Typography variant="body1" className="ml-3 text-gray-600">
                Loading events from database...
              </Typography>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert severity="error" className="mb-4 !rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <Typography variant="subtitle2" className="font-semibold">Failed to load events</Typography>
                  <Typography variant="body2">{error}</Typography>
                </div>
                <Button
                  onClick={loadEvents}
                  variant="outlined"
                  size="small"
                  startIcon={<Refresh />}
                >
                  Retry
                </Button>
              </div>
            </Alert>
          )}

          {/* Events Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
              {filteredEvents.map((event: Event) => (
              <Card
                key={event.id}
                className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 w-full max-w-sm mx-auto"
                style={{ minHeight: '440px' }}
              >
                <div className="relative">
                  <CardMedia
                    component="img"
                    height="180"
                    image={event.image || cardImage}
                    alt={event.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ 
                      maxHeight: '180px', 
                      minHeight: '180px', 
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <IconButton className="bg-white/90 hover:bg-white">
                      <FavoriteOutlined className="text-red-500" />
                    </IconButton>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Chip 
                      label={event.category} 
                      size="small" 
                      className="bg-white/90 font-medium"
                    />
                  </div>
                  {event.rating && (
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Star className="text-yellow-400" fontSize="small" />
                        {event.rating}
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 flex flex-col justify-between" style={{ minHeight: '280px' }}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <Typography variant="h6" className="font-bold text-gray-800 line-clamp-1">
                        {event.name}
                      </Typography>
                    </div>
                  
                  <Typography
                    variant="body2"
                    className="text-gray-600 mb-4 line-clamp-2"
                  >
                    {event.description}
                  </Typography>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarToday fontSize="small" className="text-indigo-500" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <LocationOn fontSize="small" className="text-red-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Person fontSize="small" className="text-green-500" />
                      {event.attendees ? `${event.attendees} attending` : "0 attending"} 
                      {event.organizer && ` • by ${event.organizer}`}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.tags && event.tags.map((tag: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        className="text-xs"
                      />
                    ))}
                  </div>

                  <Divider className="mb-3" />

                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <Typography className="text-2xl font-bold text-indigo-600">
                      {event.price > 0 ? `$${event.price}` : "Free"}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      className="!rounded-xl !px-6 !py-2 !font-semibold"
                      onClick={() => handlePurchase(event)}
                      startIcon={event.price > 0 ? <AttachMoney /> : undefined}
                    >
                      {event.price > 0 ? "Buy Ticket" : "Register"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}

          {/* No Events Found */}
          {!loading && !error && filteredEvents.length === 0 && (
            <Paper className="p-12 text-center rounded-2xl">
              <Typography variant="h6" color="textSecondary" className="mb-2">
                No events found matching your criteria
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your search filters or browse all events
              </Typography>
            </Paper>
          )}
        </div>
      </div>

      {/* Enhanced Purchase Dialog */}
      <Dialog 
        open={purchaseDialog} 
        onClose={handleClosePurchaseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-2xl"
        }}
      >
        <DialogTitle className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <AttachMoney className="text-white" />
            </div>
            <div>
              <Typography variant="h5" className="font-bold">
                Purchase Tickets
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Secure your spot at this amazing event
              </Typography>
            </div>
          </div>
        </DialogTitle>
        
        <DialogContent className="pt-4">
          {selectedEvent && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-none">
                <CardContent className="p-4">
                  <Typography variant="h6" className="font-bold mb-2">
                    {selectedEvent.name}
                  </Typography>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarToday fontSize="small" className="text-indigo-500" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationOn fontSize="small" className="text-red-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Person fontSize="small" className="text-green-500" />
                      <span>{selectedEvent.organizer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star fontSize="small" className="text-yellow-500" />
                      <span>{selectedEvent.rating} rating</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Box className="space-y-4">
                <Typography variant="h6" className="font-semibold">
                  Ticket Details
                </Typography>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <Typography variant="body1">
                      Price per ticket:
                    </Typography>
                    <Typography variant="h6" className="font-bold text-indigo-600">
                      ${selectedEvent.price}
                    </Typography>
                  </div>
                  
                  <TextField
                    label="Number of Tickets"
                    type="number"
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, max: 10 }}
                    fullWidth
                    variant="outlined"
                    className="mb-4"
                  />
                  
                  <Divider className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <Typography variant="h6" className="font-bold">
                      Total Amount:
                    </Typography>
                    <Typography variant="h4" className="font-bold text-green-600">
                      ${selectedEvent.price * ticketQuantity}
                    </Typography>
                  </div>
                </div>
              </Box>
            </div>
          )}
        </DialogContent>
        
        <DialogActions className="p-6 pt-4">
          <Button 
            onClick={handleClosePurchaseDialog} 
            variant="outlined"
            className="!rounded-xl !px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPurchase} 
            variant="contained"
            className="!rounded-xl !px-8 !py-3 !font-semibold"
            startIcon={<AttachMoney />}
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
