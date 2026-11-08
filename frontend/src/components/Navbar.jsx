// Navbar.jsx — Top navigation bar
// Uses NavLink from react-router-dom to highlight the active page.

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand" style={{ textDecoration: "none" }}>
          ⚡ EventPortal
        </NavLink>

        {/* Navigation links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-registrations" className={({ isActive }) => isActive ? "active" : ""}>
              My Registrations
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/events/new" className={({ isActive }) => isActive ? "active" : ""}>
              + Add Event
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
