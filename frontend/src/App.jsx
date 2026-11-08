// App.jsx — Root component
// Sets up React Router with all pages defined in the URS.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import EventList         from "./pages/EventList";
import EventDetail       from "./pages/EventDetail";
import RegisterForm      from "./pages/RegisterForm";
import MyRegistrations   from "./pages/MyRegistrations";
import EventForm         from "./pages/EventForm";
import EventRegistrations from "./pages/EventRegistrations";

// Global styles
import "./styles/index.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* Sticky top navbar on every page */}
      <Navbar />

      <Routes>
        {/* Student routes */}
        <Route path="/"                                  element={<EventList />} />
        <Route path="/events/:id"                        element={<EventDetail />} />
        <Route path="/events/:id/register"               element={<RegisterForm />} />
        <Route path="/my-registrations"                  element={<MyRegistrations />} />

        {/* Admin routes */}
        <Route path="/admin/events/new"                  element={<EventForm />} />
        <Route path="/admin/events/:id/edit"             element={<EventForm />} />
        <Route path="/admin/events/:id/registrations"    element={<EventRegistrations />} />
      </Routes>
    </BrowserRouter>
  );
}
