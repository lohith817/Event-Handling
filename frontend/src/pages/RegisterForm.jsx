// RegisterForm.jsx — Student registration form for a specific event
// On submit: POST /api/registrations; backend also increments registeredCount.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerForEvent } from "../api/api";

// Initial blank form state
const INITIAL = {
  studentName: "",
  rollNumber:  "",
  email:       "",
  phone:       "",
  department:  "",
};

export default function RegisterForm() {
  const { id }   = useParams();   // eventId from URL
  const navigate = useNavigate();

  const [event,     setEvent]     = useState(null);
  const [form,      setForm]      = useState(INITIAL);
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting] = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");

  // Load event details to display the event name above the form
  useEffect(() => {
    getEventById(id)
      .then((res) => setEvent(res.data))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  // Generic input handler — works for all fields
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Send registration; backend will also $inc registeredCount on the Event
      await registerForEvent({ ...form, eventId: id });
      setSuccess("You're registered! Check your email for confirmation.");
      setForm(INITIAL);

      // Redirect to My Registrations after a short delay
      setTimeout(() => navigate("/my-registrations"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
          ← Back to event
        </button>
      </div>

      {/* Page header */}
      <div className="page-header" style={{ paddingTop: 16 }}>
        <h1>Register</h1>
        {event && (
          <p>
            Filling out this form will register you for{" "}
            <strong style={{ color: "var(--teal)" }}>{event.title}</strong>
          </p>
        )}
      </div>

      {/* Alerts */}
      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Registration form */}
      <form onSubmit={handleSubmit} className="form-card">
        {/* Name + Roll Number */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentName">Full Name</label>
            <input
              id="studentName"
              name="studentName"
              type="text"
              placeholder="e.g. Priya Sharma"
              value={form.studentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              id="rollNumber"
              name="rollNumber"
              type="text"
              placeholder="e.g. 22CS045"
              value={form.rollNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">College Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone + Department */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="10-digit number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              name="department"
              type="text"
              placeholder="e.g. Computer Science"
              value={form.department}
              onChange={handleChange}
              required
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
          {submitting ? "Submitting…" : "Confirm Registration →"}
        </button>
      </form>
    </div>
  );
}
