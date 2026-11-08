// MyRegistrations.jsx — Student's personal registration history
// Student enters their email and sees all events they have registered for.
// They can also cancel a registration from here.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRegistrations, cancelRegistration } from "../api/api";

export default function MyRegistrations() {
  const navigate = useNavigate();

  const [email,   setEmail]   = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched,setSearched] = useState(false);
  const [error,   setError]   = useState("");

  // Fetch all registrations for the given email
  async function handleSearch(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setError("");
    setLoading(true);
    setSearched(false);

    try {
      const res = await getMyRegistrations(email.trim());
      setRecords(res.data);
      setSearched(true);
    } catch {
      setError("Could not fetch registrations. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Cancel a registration; optimistically remove from local state
  async function handleCancel(regId) {
    if (!window.confirm("Cancel this registration?")) return;
    try {
      await cancelRegistration(regId);
      // Remove from list and decrement is handled by the backend
      setRecords((prev) => prev.filter((r) => r._id !== regId));
    } catch {
      setError("Could not cancel registration. Please try again.");
    }
  }

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      {/* Page header */}
      <div className="page-header">
        <h1>My Registrations</h1>
        <p>Enter your college email to view all events you've signed up for.</p>
      </div>

      {/* Email lookup form */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 12, marginBottom: 32, maxWidth: 480 }}
      >
        <input
          type="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            flex: 1,
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--white)",
            padding: "10px 14px",
            outline: "none",
            fontSize: 15,
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching…" : "Look up"}
        </button>
      </form>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Spinner */}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {/* Results */}
      {searched && !loading && (
        records.length === 0 ? (
          <div className="empty-state">
            <h3>No registrations found</h3>
            <p>No events registered under <strong>{email}</strong>.</p>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 14 }}>
              Found <strong style={{ color: "var(--white)" }}>{records.length}</strong> registration(s) for{" "}
              <strong style={{ color: "var(--teal)" }}>{email}</strong>
            </p>

            {/* Registrations table */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Department</th>
                      <th>Registered At</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((reg) => (
                      <tr key={reg._id}>
                        {/* Event title — click to view event detail */}
                        <td>
                          <button
                            onClick={() => navigate(`/events/${reg.eventId?._id || reg.eventId}`)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--teal)",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 14,
                              padding: 0,
                            }}
                          >
                            {reg.eventId?.title || "Event"}
                          </button>
                        </td>

                        {/* Event date */}
                        <td>
                          {reg.eventId?.date
                            ? new Date(reg.eventId.date).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })
                            : "—"}
                        </td>

                        <td>{reg.department}</td>

                        {/* Registration timestamp */}
                        <td>
                          {new Date(reg.registeredAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short",
                          })}
                        </td>

                        {/* Cancel button */}
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(reg._id)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
