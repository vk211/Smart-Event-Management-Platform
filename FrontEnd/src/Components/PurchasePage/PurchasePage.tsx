import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

interface TicketFormData {
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  quantity: number;
  paymentMethod: string;
}

const TicketPurchasePage: React.FC = () => {
  // Mock user profile autofill
  const [formData, setFormData] = useState<TicketFormData>({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "123-456-7890",
    ticketType: "Standard",
    quantity: 1,
    paymentMethod: "Stripe",
  });

  const ticketOptions = [
    { label: "Standard - $50", value: "Standard", price: 50 },
    { label: "VIP - $100", value: "VIP", price: 100 },
  ];

  const paymentOptions = ["Stripe", "PayPal"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ticket Purchase:", formData);
    alert("✅ Ticket purchased successfully!");
  };

  const selectedTicket = ticketOptions.find(
    (t) => t.value === formData.ticketType
  );
  const totalPrice = (selectedTicket?.price || 0) * formData.quantity;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 p-6">
      <Paper elevation={6} className="w-full max-w-lg p-8 rounded-2xl shadow-xl">
        <Typography
          variant="h5"
          className="text-center font-semibold mb-6 text-gray-800"
        >
          🎫 Purchase Tickets
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info (autofilled, editable) */}
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Ticket Selection */}
          <TextField
            select
            label="Ticket Type"
            name="ticketType"
            value={formData.ticketType}
            onChange={handleChange}
            fullWidth
          >
            {ticketOptions.map((ticket) => (
              <MenuItem key={ticket.value} value={ticket.value}>
                {ticket.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Number of Tickets"
            name="quantity"
            type="number"
            fullWidth
            inputProps={{ min: 1 }}
            value={formData.quantity}
            onChange={handleChange}
          />

          {/* Payment Method */}
          <TextField
            select
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            fullWidth
          >
            {paymentOptions.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </TextField>

          <Divider className="!my-4" />

          {/* Price Summary */}
          <div className="flex justify-between items-center">
            <Typography variant="subtitle1">Total Price:</Typography>
            <Typography variant="h6" className="font-bold text-indigo-600">
              ${totalPrice}
            </Typography>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            className="!mt-4 !rounded-xl !py-3"
          >
            Confirm Purchase
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default TicketPurchasePage;
