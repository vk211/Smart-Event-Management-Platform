import React, { useState } from "react";
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
} from "@mui/material";

interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  location: string;
  price: number;
  image: string;
  organizer: string;
}

const sampleEvents: Event[] = [
  {
    id: 1,
    name: "Tech Conference 2025",
    description: "Explore AI, Cloud, and Blockchain innovations.",
    category: "Conference",
    date: "2025-10-10",
    location: "San Francisco, CA",
    price: 150,
    image: "https://source.unsplash.com/600x400/?conference",
    organizer: "TechWorld Inc.",
  },
  {
    id: 2,
    name: "Rock Concert",
    description: "Live performance by top bands!",
    category: "Concert",
    date: "2025-11-05",
    location: "Los Angeles, CA",
    price: 75,
    image: "https://source.unsplash.com/600x400/?concert",
    organizer: "MusicLive",
  },
];

const HomePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);

  const filteredEvents = sampleEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? event.category === category : true) &&
      event.price >= priceRange[0] &&
      event.price <= priceRange[1]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search & Filters */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6 grid gap-4 md:grid-cols-4">
        <TextField
          label="Search Events"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Conference">Conference</MenuItem>
            <MenuItem value="Concert">Concert</MenuItem>
            <MenuItem value="Workshop">Workshop</MenuItem>
          </Select>
        </FormControl>

        <div>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) =>
              setPriceRange(newValue as number[])
            }
            valueLabelDisplay="auto"
            min={0}
            max={500}
          />
        </div>

        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="price">Price</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
  <Card
    key={event.id}
    className="rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col"
  >
    {/* Banner Image */}
    <CardMedia
      component="img"
      height="200"
      image={event.image}
      alt={event.name}
      className="object-cover"
    />

    <CardContent className="flex flex-col flex-grow p-4">
      {/* Title & Date */}
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h6" className="font-semibold text-gray-800">
          {event.name}
        </Typography>
        <span className="text-sm text-gray-500">📅 {event.date}</span>
      </div>

      {/* Description */}
      <Typography
        variant="body2"
        className="text-gray-600 line-clamp-2 mb-3"
      >
        {event.description}
      </Typography>

      {/* Location & Organizer */}
      <div className="text-sm text-gray-500 space-y-1 mb-3">
        <p>📍 {event.location}</p>
        <p>👤 {event.organizer}</p>
      </div>

      {/* Price */}
      <Typography className="text-lg font-bold text-indigo-600 mb-4">
        {event.price > 0 ? `💲${event.price}` : "Free"}
      </Typography>

      {/* Action Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        className="!rounded-xl !py-2 !text-base mt-auto"
      >
        {event.price > 0 ? "Buy Ticket" : "Register"}
      </Button>
    </CardContent>
  </Card>
))}

      </div>
    </div>
  );
};

export default HomePage;
