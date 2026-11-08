// EventRegistrations.jsx — Admin view of all students registered for one event
// Route: /admin/events/:id/registrations

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, getAllRegistrations } from "../api/api";
import SeatPill from "../components/SeatPill";

export default function EventRegistrations() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [event,    setEvent]    = useState(null);
  const [regs,     setRegs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      // Fetch event details and registrations in parallel
      const [eventRes, regsRes] = await Promise.all([
        getEventById(id),
        getAllRegistrations({ eventId: id }),
      ]);

      setEvent(eventRes.data);
      setRegs(regsRes.data);
    } catch {
      setError("Failed to load registration data.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      {/* Back */}
      <div style={{ padding: "24px 0 8px" }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/events/${id}`)}>
          ← Back to event
        </button>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Event summary header */}
      {event && (
        <div className="page-header">
          <h1>Registrations</h1>
          <p>
            <strong style={{ color: "var(--teal)" }}>{event.title}</strong>
            {"  ·  "}
            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            {"  ·  "}
            <SeatPill total={event.totalSeats} registered={event.registeredCount} />
          </p>
        </div>
      )}

      {/* Stats row */}
      {event && (
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard label="Total Seats"  value={event.totalSeats} />
          <StatCard label="Registered"   value={event.registeredCount} color="var(--teal)" />
          <StatCard label="Seats Left"   value={event.totalSeats - event.registeredCount}
            color={event.totalSeats - event.registeredCount <= 0 ? "var(--danger)" : undefined} />
        </div>
      )}

      {/* Registrations table */}
      {regs.length === 0 ? (
        <div className="empty-state">
          <h3>No registrations yet</h3>
          <p>Share the event with students to start collecting registrations.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {regs.length} student{regs.length !== 1 ? "s" : ""} registered
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {regs.map((reg, idx) => (
                  <tr key={reg._id}>
                    <td style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: "var(--white)" }}>{reg.studentName}</td>
                    <td>{reg.rollNumber}</td>
                    <td>{reg.email}</td>
                    <td>{reg.phone}</td>
                    <td>{reg.department}</td>
                    <td>
                      {new Date(reg.registeredAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Small stat card for the summary row
function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ padding: "16px 24px", minWidth: 140 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || "var(--white)", fontFamily: "Space Grotesk, sans-serif" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
    </div>
  );
}
