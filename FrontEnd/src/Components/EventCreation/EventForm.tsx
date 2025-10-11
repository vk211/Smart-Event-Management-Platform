import React, { useState, type ChangeEvent,type FormEvent } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { 
  AddCircle, 
  Delete, 
  Event,
  AttachMoney,
  Schedule,
  Image,
  People
} from "@mui/icons-material";
import cardImage from "../../assets/card.jpg";

interface TicketTier {
  type: string;
  price: number;
}

interface EventFormData {
  name: string;
  description: string;
  category: string;
  tags: string;
  startDate: Date | null;
  endDate: Date | null;
  venue: string;
  capacity: number;
  banner: File | null;
  ticketTiers: TicketTier[];
  agenda: string;
}

const categories = [
  { value: "Conference", icon: "📅", description: "Professional conferences and seminars" },
  { value: "Concert", icon: "🎵", description: "Music concerts and performances" },
  { value: "Workshop", icon: "🛠️", description: "Learning workshops and training" },
  { value: "Exhibition", icon: "🎨", description: "Art exhibitions and showcases" },
  { value: "Festival", icon: "🎉", description: "Festivals and celebrations" },
  { value: "Meetup", icon: "🤝", description: "Community meetups and networking" }
];

const EventForm: React.FC = () => {
  // Add error boundary fallback
  const [hasError, setHasError] = useState(false);
  
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    category: "",
    tags: "",
    startDate: null,
    endDate: null,
    venue: "",
    capacity: 0,
    banner: null,
    ticketTiers: [{ type: "Standard", price: 0 }],
    agenda: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleTierChange = (index: number, field: string, value: string) => {
    const updated = [...formData.ticketTiers];
    (updated[index] as any)[field] = field === "price" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, ticketTiers: updated }));
  };

  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, { type: "", price: 0 }],
    }));
  };

  const removeTier = (index: number) => {
    const updated = formData.ticketTiers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ticketTiers: updated }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSend = { ...formData, banner: undefined };
      const response = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("✅ Event created successfully!");
      } else {
        alert("❌ Failed to create event");
      }
    } catch (error) {
      console.error("Event creation error:", error);
      alert("❌ Error creating event");
    }
  };

  // Error boundary fallback
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-red-500 mb-4">There was an error loading the event creation form.</p>
          <button 
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Typography variant="h3" className="font-bold text-gray-800 mb-2">
            🎟️ Create Amazing Event
          </Typography>
          <Typography variant="h6" className="text-gray-600 mb-6">
            Bring your vision to life and connect with your audience
          </Typography>
        </div>

        <Card className="rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <Typography variant="h5" className="font-bold mb-2">
              Event Details
            </Typography>
            <Typography variant="body1" className="opacity-90">
              Fill in the information below to create your event
            </Typography>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
                <CardContent className="p-6">
                  <Box className="flex items-center gap-2 mb-4">
                    <Event className="text-indigo-500" />
                    <Typography variant="h6" className="font-semibold">
                      Basic Information
                    </Typography>
                  </Box>
                  
                  <div className="space-y-4">
                    <TextField
                      label="Event Name"
                      name="name"
                      fullWidth
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="Enter a catchy event name"
                    />

                    <TextField
                      label="Description"
                      name="description"
                      fullWidth
                      multiline
                      minRows={4}
                      value={formData.description}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="Describe what makes your event special..."
                    />

                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField
                        select
                        label="Category"
                        name="category"
                        fullWidth
                        value={formData.category}
                        onChange={handleChange}
                        variant="outlined"
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{cat.icon}</span>
                              <div>
                                <Typography variant="subtitle2">{cat.value}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {cat.description}
                                </Typography>
                              </div>
                            </div>
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Tags/Keywords"
                        name="tags"
                        fullWidth
                        value={formData.tags}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="AI, Music, Startup"
                        helperText="Separate tags with commas"
                      />
                    </Box>
                  </div>
                </CardContent>
              </Card>

              {/* Date & Location Section */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-none">
                <CardContent className="p-6">  
                  <Box className="flex items-center gap-2 mb-4">
                    <Schedule className="text-green-500" />
                    <Typography variant="h6" className="font-semibold">
                      Date & Location
                    </Typography>
                  </Box>
                  
                  <div className="space-y-4">
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField
                        label="Start Date & Time"
                        name="startDate"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ""}
                        onChange={(e) => handleDateChange("startDate", e.target.value ? new Date(e.target.value) : null)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="End Date & Time"
                        name="endDate"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
                        onChange={(e) => handleDateChange("endDate", e.target.value ? new Date(e.target.value) : null)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>

                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField
                        label="Venue / Location"
                        name="venue"
                        fullWidth
                        value={formData.venue}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Event venue or online"
                      />
                      <TextField
                        label="Capacity"
                        name="capacity"
                        type="number"
                        fullWidth
                        value={formData.capacity}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Maximum attendees"
                      />
                    </Box>
                  </div>
                </CardContent>
              </Card>

              {/* Visual & Pricing Section */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-none">
                <CardContent className="p-6">
                  <Box className="flex items-center gap-2 mb-4">
                    <Image className="text-purple-500" />
                    <Typography variant="h6" className="font-semibold">
                      Visual & Pricing
                    </Typography>
                  </Box>

                  <div className="space-y-6">
                    {/* Event Banner Upload */}
                    <Box>
                      <Typography variant="subtitle1" className="mb-3 font-medium">
                        Event Banner
                      </Typography>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <Avatar
                            src={formData.banner ? URL.createObjectURL(formData.banner) : cardImage}
                            variant="rounded"
                            sx={{ width: 90, height: 60 }}
                            className="border-2 border-dashed border-gray-300"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outlined" 
                            component="label"
                            className="!rounded-xl !text-sm"
                            startIcon={<Image />}
                            size="small"
                          >
                            Upload Banner
                            <input
                              type="file"
                              hidden
                              name="banner"
                              accept="image/*"
                              onChange={handleChange}
                            />
                          </Button>
                          <Typography variant="caption" color="textSecondary">
                            Recommended: 400x180px
                          </Typography>
                        </div>
                      </div>
                    </Box>

                    {/* Ticket Tiers */}
                    <Box>
                      <Typography variant="subtitle1" className="mb-3 font-medium flex items-center gap-2">
                        <AttachMoney className="text-green-500" />
                        Ticket Pricing
                      </Typography>
                      
                      <div className="space-y-3">
                        {formData.ticketTiers.map((tier, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex gap-3 items-center">
                                <TextField
                                  label="Ticket Type"
                                  value={tier.type}
                                  onChange={(e) => handleTierChange(index, "type", e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  className="flex-1"
                                />
                                <TextField
                                  label="Price ($)"
                                  type="number"
                                  value={tier.price}
                                  onChange={(e) => handleTierChange(index, "price", e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  className="w-32"
                                />
                                <IconButton 
                                  onClick={() => removeTier(index)} 
                                  color="error"
                                  disabled={formData.ticketTiers.length === 1}
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button
                          startIcon={<AddCircle />}
                          onClick={addTier}
                          variant="outlined"
                          className="!rounded-xl"
                        >
                          Add Ticket Tier
                        </Button>
                      </div>
                    </Box>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details Section */}
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-none">
                <CardContent className="p-6">
                  <Box className="flex items-center gap-2 mb-4">
                    <People className="text-orange-500" />
                    <Typography variant="h6" className="font-semibold">
                      Additional Details
                    </Typography>
                  </Box>

                  <TextField
                    label="Agenda / Schedule"
                    name="agenda"
                    fullWidth
                    multiline
                    minRows={4}
                    value={formData.agenda}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Outline your event schedule, speakers, activities..."
                  />
                </CardContent>
              </Card>

              <Divider className="my-8" />

              {/* Submit Section */}
              <div className="text-center">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  className="!rounded-2xl !px-12 !py-4 !text-lg !font-semibold !shadow-lg"
                  startIcon={<Event />}
                >
                  Create Event
                </Button>
                <Typography variant="body2" color="textSecondary" className="mt-3">
                  Your event will be reviewed and published within 24 hours
                </Typography>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventForm;
``