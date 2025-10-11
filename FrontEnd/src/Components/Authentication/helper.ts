// helper.ts
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  exp: number;
  iat: number;
}

// export const getToken = (): string | null => localStorage.getItem("token");

export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) {
    console.log("getUserRole: No token found");
    return null;
  }

  try {
    let role: string;
    
    // Handle mock token format
    if (token.startsWith('mock.')) {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error("getUserRole: Invalid mock token format");
        return null;
      }
      const payload = JSON.parse(atob(parts[1]));
      role = payload.role;
      console.log("getUserRole: Extracted role from mock token:", role);
    } else {
      const decoded = jwtDecode<DecodedToken>(token);
      role = decoded.role;
      console.log("getUserRole: Extracted role from JWT token:", role);
    }
    
    // Ensure role is uppercase for consistency
    const finalRole = role?.toUpperCase() || null;
    console.log("getUserRole: Final role:", finalRole);
    return finalRole;
  } catch (err) {
    console.error("getUserRole: Token parsing error:", err);
    return null;
  }
};

export const API_BASE_URL = "http://localhost:8081/api"; // base path

// Test function to check backend connectivity
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers,
    });
    
    // Consider 403 as "backend is running but requires auth" - still a connection
    return res.ok || res.status === 403;
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
};

export const registerUser = async (payload: any) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to register user");
  return await res.text(); // backend returns a simple "Registered" string
};

// Mock login for testing when backend is not available
const mockLogin = async (payload: any) => {
  console.log("Using mock login - backend not available");
  
  // Mock credentials for testing
  const mockUsers = [
    { email: "admin@test.com", password: "admin123", role: "ADMIN", userId: "1", name: "Admin User" },
    { email: "organizer@test.com", password: "org123", role: "ORGANIZER", userId: "2", name: "Organizer User" },
    { email: "attendee@test.com", password: "att123", role: "ATTENDEE", userId: "3", name: "Attendee User" },
    { email: "test@test.com", password: "test123", role: "ATTENDEE", userId: "4", name: "Test User" }
  ];
  
  const user = mockUsers.find(u => u.email === payload.email && u.password === payload.password);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // Create a mock JWT token (for testing only)
  const mockTokenPayload = {
    sub: user.userId,
    role: user.role.toUpperCase(),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours expiry
    iat: Math.floor(Date.now() / 1000),
    name: user.name
  };
  
  console.log("Creating mock token with payload:", mockTokenPayload);
  const mockToken = btoa(JSON.stringify(mockTokenPayload));
  const fullToken = `mock.${mockToken}.signature`;
  console.log("Generated mock token:", fullToken);
  
  return {
    token: fullToken,
    userId: user.userId,
    name: user.name,
    role: user.role.toUpperCase()
  };
};

export const loginUser = async (payload: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Login failed: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return await mockLogin(payload);
    }
    throw error;
  }
};

export const getUserDetails = async (token: string, userId: string) => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//   if (!res.ok) throw new Error("Failed to fetch user details");
//   return await res.json();
// };


  if (!res.ok) throw new Error("Failed to fetch user details");
  return await res.json();
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) {
    console.log("isTokenValid: No token found");
    return false;
  }

  try {
    let decoded: DecodedToken;
    
    // Handle mock token format
    if (token.startsWith('mock.')) {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error("isTokenValid: Invalid mock token format");
        return false;
      }
      decoded = JSON.parse(atob(parts[1]));
    } else {
      decoded = jwtDecode<DecodedToken>(token);
    }
    
    const currentTime = Date.now() / 1000;
    const isValid = decoded.exp > currentTime;
    
    console.log("isTokenValid: Token validation result:", { 
      exp: decoded.exp, 
      currentTime, 
      isValid,
      timeRemaining: decoded.exp - currentTime 
    });
    
    if (!isValid) {
      console.log("isTokenValid: Token expired, clearing from storage");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
    
    return isValid;
  } catch (err) {
    console.error("isTokenValid: Token validation error:", err);
    // Clear invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

// Events API functions
export const fetchEvents = async () => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE_URL}/eventcards`, {
      method: "GET",
      headers,
    });
    
    // Handle authentication errors gracefully
    if (res.status === 401 || res.status === 403) {
      console.warn("Authentication required for /api/eventcards, using mock data");
      return getMockEvents();
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch events: ${res.status} - ${errorText}`);
    }
    
    const events = await res.json();
    console.log(`Fetched ${Array.isArray(events) ? events.length : 0} events from backend`);
    return events;
  } catch (error) {
    console.warn("Using mock events due to backend error:", error instanceof Error ? error.message : error);
    return getMockEvents();
  }
};



// Mock events for fallback when backend is not available
const getMockEvents = () => {
  return [
    // {
    //   id: 1,
    //   name: "Tech Conference 2025",
    //   description: "Explore cutting-edge AI, Cloud Computing, and Blockchain innovations with industry leaders.",
    //   category: "Conference",
    //   date: "2025-11-15",
    //   location: "San Francisco, CA",
    //   price: 299,
    //   image: "",
    //   organizer: "TechWorld Inc.",
    //   rating: 4.8,
    //   attendees: 342,
    //   tags: ["AI", "Blockchain", "Cloud"]
    // },
    // {
    //   id: 2,
    //   name: "Summer Music Festival",
    //   description: "3-day outdoor music festival featuring top artists from around the world.",
    //   category: "Concert",
    //   date: "2025-12-01",
    //   location: "Los Angeles, CA",
    //   price: 150,
    //   image: "",
    //   organizer: "MusicLive Events",
    //   rating: 4.6,
    //   attendees: 1456,
    //   tags: ["Music", "Festival", "Outdoor"]
    // },
    // {
    //   id: 3,
    //   name: "Startup Bootcamp",
    //   description: "Intensive 2-day workshop on building and scaling your startup from idea to IPO.",
    //   category: "Workshop",
    //   date: "2025-10-25",
    //   location: "New York, NY",
    //   price: 199,
    //   image: "",
    //   organizer: "StartupHub",
    //   rating: 4.9,
    //   attendees: 89,
    //   tags: ["Startup", "Business", "Networking"]
    // },
    // {
    //   id: 4,
    //   name: "Art & Design Expo",
    //   description: "Contemporary art exhibition showcasing digital art, sculptures, and interactive installations.",
    //   category: "Exhibition",
    //   date: "2025-11-08",
    //   location: "Chicago, IL",
    //   price: 45,
    //   image: "",
    //   organizer: "Modern Art Gallery",
    //   rating: 4.4,
    //   attendees: 234,
    //   tags: ["Art", "Design", "Digital"]
    // },
    // {
    //   id: 5,
    //   name: "Food & Wine Festival",
    //   description: "Culinary celebration featuring world-class chefs, wine tastings, and gourmet experiences.",
    //   category: "Festival",
    //   date: "2025-12-15",
    //   location: "Miami, FL",
    //   price: 125,
    //   image: "",
    //   organizer: "Culinary Events Co.",
    //   rating: 4.7,
    //   attendees: 567,
    //   tags: ["Food", "Wine", "Culinary"]
    // },
    // {
    //   id: 6,
    //   name: "Photography Workshop",
    //   description: "Master the art of portrait and landscape photography with professional photographers.",
    //   category: "Workshop",
    //   date: "2025-10-30",
    //   location: "Seattle, WA",
    //   price: 89,
    //   image: "",
    //   organizer: "Photo Masters",
    //   rating: 4.8,
    //   attendees: 45,
    //   tags: ["Photography", "Workshop", "Creative"]
    // }
  ];
};
