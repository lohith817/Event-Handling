// api.js — all API call functions for Events and Registrations
// Import this wherever you need to fetch data from the backend.

import api from "./axios";

// ─── EVENT APIs ────────────────────────────────────────────────────────────────

// Fetch all events. Optional filters: category, upcoming
export const getAllEvents = (params = {}) => api.get("/api/events", { params });

// Fetch a single event by its MongoDB _id
export const getEventById = (id) => api.get(`/api/events/${id}`);

// Create a new event (organiser/admin use)
export const createEvent = (data) => api.post("/api/events", data);

// Update an existing event by _id
export const updateEvent = (id, data) => api.put(`/api/events/${id}`, data);

// Delete an event by _id
export const deleteEvent = (id) => api.delete(`/api/events/${id}`);

// ─── REGISTRATION APIs ─────────────────────────────────────────────────────────

// Register a student for an event
export const registerForEvent = (data) => api.post("/api/registrations", data);

// Get all registrations, optionally filtered by eventId
export const getAllRegistrations = (params = {}) =>
  api.get("/api/registrations", { params });

// Get a single registration by _id
export const getRegistrationById = (id) =>
  api.get(`/api/registrations/${id}`);

// Get all registrations belonging to a student email
export const getMyRegistrations = (email) =>
  api.get("/api/registrations/student", { params: { email } });

// Cancel (delete) a registration by _id
export const cancelRegistration = (id) =>
  api.delete(`/api/registrations/${id}`);
