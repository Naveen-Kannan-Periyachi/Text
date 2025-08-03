import React, { useState } from "react";

function FeedbackForm({ user }) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    if (!message.trim() || message.length < 5) {
      setError("Please enter feedback (min 5 characters).");
      return;
    }
    if (message.length > 1000) {
      setError("Feedback too long (max 1000 characters).");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/actions/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: user && user._id, rating })
      });
      if (res.ok) {
        setStatus("Thank you for your feedback!");
        setMessage("");
        setRating(0);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit feedback.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit} aria-label="Feedback form">
      <label htmlFor="feedback-message" className="feedback-label">Your Feedback</label>
      <textarea
        id="feedback-message"
        className="feedback-textarea"
        placeholder="Type your suggestion or feedback here..."
        rows="4"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        minLength={5}
        maxLength={1000}
        aria-required="true"
      ></textarea>
      <div className="feedback-rating" aria-label="Rate your experience">
        <span className="feedback-label">Your Rating:</span>
        {[1,2,3,4,5].map(star => (
          <button
            type="button"
            key={star}
            className={"star-btn" + (star <= rating ? " selected" : "")}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
          >
            {star <= rating ? "★" : "☆"}
          </button>
        ))}
      </div>
      <button type="submit" className="feedback-submit" disabled={loading} aria-busy={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
      {error && <div className="error-msg" role="alert">{error}</div>}
      {status && <div className="success-msg" role="status">{status}</div>}
    </form>
  );
}

export default FeedbackForm;
