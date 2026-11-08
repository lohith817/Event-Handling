// EventForm.jsx — Admin page to Create or Edit an event
// Route /admin/events/new       → Create mode
// Route /admin/events/:id/edit  → Edit mode (pre-fills existing data)

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createEvent, getEventById, updateEvent } from "../api/api";

const CATEGORIES = ["Technical", "Cultural", "Sports", "Workshop"];

// Blank form for create mode
const INITIAL = {
  title:           "",
  description:     "",
  category:        "Technical",
  date:            "",
  time:            "",
  venue:           "",
  organiser:       "",
  totalSeats:      "",
  deadline:        "",
};

export default function EventForm() {
  const { id }   = useParams();       // Present only in edit mode
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [form,      setForm]      = useState(INITIAL);
  const [loading,   setLoading]   = useState(isEdit);  // Load existing data in edit mode
  const [submitting,setSubmitting] = useState(false);
  const [error,     setError]     = useState("");

  // In edit mode, prefill the form with the existing event
  useEffect(() => {
    if (!isEdit) return;

    getEventById(id)
      .then((res) => {
        const e = res.data;
        setForm({
          title:       e.title,
          description: e.description,
          category:    e.category,
          // Convert ISO date string to YYYY-MM-DD for the date input
          date:        e.date?.slice(0, 10)     || "",
          time:        e.time,
          venue:       e.venue,
          organiser:   e.organiser,
          totalSeats:  e.totalSeats,
          deadline:    e.deadline?.slice(0, 10) || "",
        });
      })
      .catch(() => setError("Could not load event details."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // Generic change handler for all inputs
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isEdit) {
        // PUT — update existing event
        await updateEvent(id, form);
        navigate(`/events/${id}`);
      } else {
        // POST — create new event; registeredCount defaults to 0 on backend
        const res = await createEvent(form);
        navigate(`/events/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      {/* Back */}
      <div style={{ padding: "24px 0 8px" }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Page header */}
      <div className="page-header" style={{ paddingTop: 16 }}>
        <h1>{isEdit ? "Edit Event" : "Add New Event"}</h1>
        <p>{isEdit ? "Update the details below." : "Fill in the details to publish a new event."}</p>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 720 }}>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            id="title" name="title" type="text"
            placeholder="e.g. Hackathon 2025"
            value={form.title} onChange={handleChange} required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description" name="description" rows={4}
            placeholder="What is this event about?"
            value={form.description} onChange={handleChange} required
            style={{
              background: "var(--navy)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", color: "var(--white)",
              padding: "10px 14px", resize: "vertical", outline: "none",
            }}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category" name="category"
            value={form.category} onChange={handleChange} required
            style={{
              background: "var(--navy)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", color: "var(--white)",
              padding: "10px 14px", outline: "none",
            }}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Date + Time */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Event Date</label>
            <input
              id="date" name="date" type="date"
              value={form.date} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Start Time</label>
            <input
              id="time" name="time" type="text"
              placeholder="e.g. 10:00 AM"
              value={form.time} onChange={handleChange} required
            />
          </div>
        </div>

        {/* Venue + Organiser */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="venue">Venue</label>
            <input
              id="venue" name="venue" type="text"
              placeholder="e.g. Seminar Hall, Block A"
              value={form.venue} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="organiser">Organiser</label>
            <input
              id="organiser" name="organiser" type="text"
              placeholder="Faculty name or club"
              value={form.organiser} onChange={handleChange} required
            />
          </div>
        </div>

        {/* Total Seats + Deadline */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="totalSeats">Total Seats</label>
            <input
              id="totalSeats" name="totalSeats" type="number"
              placeholder="e.g. 100" min={1}
              value={form.totalSeats} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="deadline">Registration Deadline</label>
            <input
              id="deadline" name="deadline" type="date"
              value={form.deadline} onChange={handleChange} required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {submitting
            ? (isEdit ? "Saving…" : "Creating…")
            : (isEdit ? "Save Changes" : "Publish Event →")}
        </button>
      </form>
    </div>
  );
}
