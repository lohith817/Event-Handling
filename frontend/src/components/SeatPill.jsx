// SeatPill.jsx — Signature animated seat counter badge
// Shows available seats. Pulses red when ≤ 10% seats remain. Greyed out when full.

export default function SeatPill({ total, registered }) {
  const left = total - registered;
  const pct  = left / total;

  // Determine visual state
  const state = left === 0 ? "full" : pct <= 0.1 ? "low" : "ok";
  const label =
    state === "full" ? "Sold out" :
    state === "low"  ? `Only ${left} left!` :
    `${left} seats left`;

  return (
    <span className={`seat-pill ${state === "low" ? "low" : state === "full" ? "full" : ""}`}>
      {/* Dot indicator */}
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "currentColor", flexShrink: 0
      }} />
      {label}
    </span>
  );
}
