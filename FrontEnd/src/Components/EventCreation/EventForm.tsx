import React, { useState, type ChangeEvent,type FormEvent } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AddCircle, Delete } from "@mui/icons-material";

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

const categories = ["Conference", "Concert", "Workshop", "Meetup"];

const EventForm: React.FC = () => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Event Created:", formData);
    // TODO: send data to backend API
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-50">
      <Paper elevation={6} className="w-full max-w-3xl p-8 rounded-2xl shadow-lg">
        <Typography variant="h5" className="font-semibold mb-6 text-gray-800">
          🎟️ Create Event
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Event Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            minRows={3}
            value={formData.description}
            onChange={handleChange}
          />

          <TextField
            select
            label="Category"
            name="category"
            fullWidth
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Tags/Keywords"
            name="tags"
            fullWidth
            placeholder="e.g. AI, Music, Startup"
            value={formData.tags}
            onChange={handleChange}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="grid grid-cols-2 gap-4">
              <DateTimePicker
                label="Start Date & Time"
                value={formData.startDate}
                onChange={(date) => handleDateChange("startDate", date)}
              />
              <DateTimePicker
                label="End Date & Time"
                value={formData.endDate}
                onChange={(date) => handleDateChange("endDate", date)}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            label="Venue / Location"
            name="venue"
            fullWidth
            value={formData.venue}
            onChange={handleChange}
          />

          <TextField
            label="Capacity"
            name="capacity"
            type="number"
            fullWidth
            value={formData.capacity}
            onChange={handleChange}
          />

          {/* Event Banner Upload */}
          <Box className="flex items-center gap-4">
            <Avatar
              src={formData.banner ? URL.createObjectURL(formData.banner) : ""}
              variant="rounded"
              sx={{ width: 100, height: 60 }}
            />
            <Button variant="outlined" component="label">
              Upload Banner
              <input
                type="file"
                hidden
                name="banner"
                accept="image/*"
                onChange={handleChange}
              />
            </Button>
          </Box>

          {/* Ticket Tiers */}
          <Box>
            <Typography variant="subtitle1" className="mb-2 font-medium">
              Ticket Pricing
            </Typography>
            {formData.ticketTiers.map((tier, index) => (
              <Box
                key={index}
                className="flex gap-3 items-center mb-2 border p-2 rounded-lg"
              >
                <TextField
                  label="Type"
                  value={tier.type}
                  onChange={(e) =>
                    handleTierChange(index, "type", e.target.value)
                  }
                />
                <TextField
                  label="Price"
                  type="number"
                  value={tier.price}
                  onChange={(e) =>
                    handleTierChange(index, "price", e.target.value)
                  }
                />
                <IconButton onClick={() => removeTier(index)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddCircle />}
              onClick={addTier}
              variant="outlined"
            >
              Add Tier
            </Button>
          </Box>

          <TextField
            label="Agenda / Schedule"
            name="agenda"
            fullWidth
            multiline
            minRows={3}
            value={formData.agenda}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            className="!mt-6 !rounded-xl !py-3"
          >
            Create Event
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default EventForm;
