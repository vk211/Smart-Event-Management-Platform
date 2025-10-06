import React, { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Avatar,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

type Role = "ADMIN" | "ORGANIZER" | "ATTENDEE" | "";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
  organization: string;
  profilePic: File | null;
}

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<number>(0); // 0 = Login, 1 = Register
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    organization: "",
    profilePic: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // TODO: Integrate with backend API (login/register)
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50">
      <Paper elevation={6} className="w-full max-w-md p-8 rounded-2xl shadow-lg">
        <Typography
          variant="h5"
          className="text-center font-semibold mb-6 text-gray-800"
        >
          {tab === 0 ? "Welcome Back 👋" : "Create an Account ✨"}
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Registration fields */}
          {tab === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                />
              </div>

              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}

          {/* Common fields */}
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />

          {tab === 1 && (
            <>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <TextField
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="ORGANIZER">Organizer</MenuItem>
                <MenuItem value="ATTENDEE">Attendee</MenuItem>
              </TextField>

              {formData.role === "ORGANIZER" && (
                <TextField
                  label="Organization Name"
                  name="organization"
                  fullWidth
                  value={formData.organization}
                  onChange={handleChange}
                />
              )}

              {formData.role === "ATTENDEE" && (
                <Box className="flex items-center gap-4">
                  <Avatar
                    src={
                      formData.profilePic
                        ? URL.createObjectURL(formData.profilePic)
                        : ""
                    }
                    sx={{ width: 48, height: 48 }}
                  />
                  <Button variant="outlined" component="label">
                    Upload Picture
                    <input
                      type="file"
                      hidden
                      name="profilePic"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </Button>
                </Box>
              )}
            </>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            className="!mt-4 !rounded-xl !py-3"
          >
            {tab === 0 ? "Login" : "Register"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AuthPage;
