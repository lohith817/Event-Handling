// EventCard.jsx — Card shown in the event list grid
// Displays title, category badge, date, venue, organiser, and seat pill.

import { useNavigate } from "react-router-dom";
import SeatPill from "./SeatPill";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  // Format date to a human-readable string e.g. "Mon, 14 Jul 2025"
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="card"
      onClick={() => navigate(`/events/${event._id}`)}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/events/${event._id}`)}
    >
      {/* Top row: category badge + seat pill */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span className={`badge badge-${event.category}`}>{event.category}</span>
        <SeatPill total={event.totalSeats} registered={event.registeredCount} />
      </div>

      {/* Event title */}
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--white)" }}>
        {event.title}
      </h3>

      {/* Short description — capped at 2 lines via CSS */}
      <p style={{
        color: "var(--text-muted)",
        fontSize: 13,
        marginBottom: 16,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {event.description}
      </p>

      {/* Meta: date, time, venue */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <MetaRow icon="📅" text={`${formattedDate} · ${event.time}`} />
        <MetaRow icon="📍" text={event.venue} />
        <MetaRow icon="👤" text={event.organiser} />
      </div>

      {/* Deadline */}
      <div style={{
        marginTop: 16,
        paddingTop: 14,
        borderTop: "1px solid var(--border)",
        fontSize: 12,
        color: "var(--text-muted)",
      }}>
        Register by{" "}
        <strong style={{ color: "var(--white-dim)" }}>
          {new Date(event.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </strong>
      </div>
    </div>
  );
}

// Small helper for icon + text rows
function MetaRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--white-dim)" }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
