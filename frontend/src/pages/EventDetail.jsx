// EventDetail.jsx — Full detail view for a single event
// Shows all event fields, seat pill, and a "Register Now" button that
// routes to the registration form.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../api/api";
import SeatPill from "../components/SeatPill";

export default function EventDetail() {
  const { id }     = useParams();   // MongoDB _id from the URL
  const navigate   = useNavigate();

  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  async function fetchEvent() {
    try {
      setLoading(true);
      const res = await getEventById(id);
      setEvent(res.data);
    } catch (err) {
      setError(err.response?.status === 404 ? "Event not found." : "Failed to load event.");
    } finally {
      setLoading(false);
    }
  }

  // Admin: delete event and go back to list
  async function handleDelete() {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await deleteEvent(id);
      navigate("/");
    } catch {
      setError("Could not delete the event.");
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error)   return <div className="container"><div className="alert alert-error" style={{ marginTop: 40 }}>{error}</div></div>;
  if (!event)  return null;

  const seatsLeft   = event.totalSeats - event.registeredCount;
  const isFull      = seatsLeft === 0;
  const isDeadlined = new Date(event.deadline) < new Date();

  // Whether registration is still open
  const canRegister = !isFull && !isDeadlined;

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      {/* Back link */}
      <div style={{ padding: "24px 0 8px" }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Hero card */}
      <div className="event-detail-hero">
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span className={`badge badge-${event.category}`}>{event.category}</span>
          <SeatPill total={event.totalSeats} registered={event.registeredCount} />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{event.title}</h1>

        {/* Description */}
        <p style={{ color: "var(--white-dim)", lineHeight: 1.7, maxWidth: 680 }}>{event.description}</p>

        {/* Meta grid */}
        <div className="event-meta-grid">
          <MetaItem label="Date"
            value={new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
          <MetaItem label="Time"     value={event.time} />
          <MetaItem label="Venue"    value={event.venue} />
          <MetaItem label="Organiser" value={event.organiser} />
          <MetaItem label="Total Seats"    value={event.totalSeats} />
          <MetaItem label="Registered"     value={event.registeredCount} />
          <MetaItem label="Register by"
            value={new Date(event.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
        </div>
      </div>

      {/* Deadline / full warnings */}
      {isDeadlined && !isFull && (
        <div className="alert alert-error">Registration deadline has passed.</div>
      )}
      {isFull && (
        <div className="alert alert-error">This event is fully booked.</div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {/* Register button — disabled if full or deadline passed */}
        <button
          className="btn btn-primary"
          disabled={!canRegister}
          onClick={() => navigate(`/events/${id}/register`)}
        >
          {isFull ? "Event Full" : isDeadlined ? "Deadline Passed" : "Register Now →"}
        </button>

        {/* Admin: edit */}
        <button
          className="btn btn-outline"
          onClick={() => navigate(`/admin/events/${id}/edit`)}
        >
          Edit Event
        </button>

        {/* Admin: view registrations */}
        <button
          className="btn btn-outline"
          onClick={() => navigate(`/admin/events/${id}/registrations`)}
        >
          View Registrations
        </button>

        {/* Admin: delete */}
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

// Reusable meta field display
function MetaItem({ label, value }) {
  return (
    <div className="meta-item">
      <label>{label}</label>
      <span>{value}</span>
    </div>
  );
}
