import React from "react";
import { Link } from "react-router-dom";

function FeatureCard({ icon, title, description, to }) {
  const CardContent = (
    <div className="feature-card feature-extract">
      <div className="feature-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
  return to ? (
    <Link to={to} style={{ textDecoration: 'none' }}>
      {CardContent}
    </Link>
  ) : CardContent;
}

export default FeatureCard;
