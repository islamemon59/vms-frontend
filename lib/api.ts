import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth APIs
export const signup = (data: { name: string; email: string; password: string; role?: string }) =>
  API.post("/auth/signup", data);
export const signin = (data: { email: string; password: string }) =>
  API.post("/auth/signin", data);
export const getMe = () => API.get("/auth/me");

// Volunteer APIs
export const getVolunteers = () => API.get("/volunteers");
export const getVolunteer = (id: string) => API.get(`/volunteers/${id}`);
export const createVolunteer = (data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string;
}) => API.post("/volunteers", data);
export const deleteVolunteer = (id: string) => API.delete(`/volunteers/${id}`);

// Event APIs
export const getEvents = () => API.get("/events");
export const getEvent = (id: string) => API.get(`/events/${id}`);
export const createEvent = (data: {
  title: string;
  description: string;
  location: string;
  date: string;
  maxVolunteers: number;
}) => API.post("/events", data);
export const updateEvent = (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    location: string;
    date: string;
    maxVolunteers: number;
  }>
) => API.put(`/events/${id}`, data);
export const deleteEvent = (id: string) => API.delete(`/events/${id}`);

// Participation APIs
export const getParticipations = () => API.get("/participation");
export const createParticipation = (data: {
  volunteerId: string;
  eventId: string;
}) => API.post("/participation", data);
export const deleteParticipation = (id: string) =>
  API.delete(`/participation/${id}`);

export default API;
