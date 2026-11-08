// EventList.jsx — Main landing page showing all events
// Features: category filter chips, upcoming-only toggle, loading & empty states.

import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { getAllEvents } from "../api/api";

// All category options from the URS
const CATEGORIES = ["All", "Technical", "Cultural", "Sports", "Workshop"];

export default function EventList() {
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [category, setCategory] = useState("All");
  const [upcoming, setUpcoming] = useState(false);

  // Fetch events whenever the filter changes
  useEffect(() => {
    fetchEvents();
  }, [category, upcoming]);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError("");

      // Build query params
      const params = {};
      if (category !== "All") params.category = category;
      if (upcoming) params.upcoming = true;

      const res = await getAllEvents(params);
      setEvents(res.data);
    } catch (err) {
      setError("Could not load events. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      {/* Page header */}
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Discover and register for events happening at your college.</p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}

        {/* Upcoming toggle */}
        <button
          className={`filter-chip ${upcoming ? "active" : ""}`}
          onClick={() => setUpcoming((p) => !p)}
          style={{ marginLeft: "auto" }}
        >
          📅 Upcoming only
        </button>
      </div>

      {/* Error state */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading spinner */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : events.length === 0 ? (
        /* Empty state */
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Try a different category or check back later.</p>
        </div>
      ) : (
        /* Events grid */
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
