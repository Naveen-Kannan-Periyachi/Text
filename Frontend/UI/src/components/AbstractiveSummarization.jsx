import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "../App.css";

function AbstractiveSummarization() {
  const [file, setFile] = React.useState(null);
  const [results, setResults] = React.useState([]); // { filename, summary, error, loading, expanded }
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    // Add a new result card in loading state
    setResults((prev) => [
      {
        filename: file.name,
        summary: "",
        error: "",
        loading: true,
        expanded: true,
      },
      ...prev,
    ]);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("summary_type", "abstractive");
    try {
      const res = await fetch("http://localhost:8000/summarize/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults((prev) => {
        const idx = prev.findIndex(r => r.loading && r.filename === file.name);
        if (idx === -1) return prev;
        const updated = [...prev];
        let summaryText = "";
        if (res.ok && data.summaries) {
          // Concatenate all page summaries
          summaryText = Object.entries(data.summaries)
            .map(([page, summary]) => `Page ${page}:\n${summary}`)
            .join("\n\n");
        }
        updated[idx] = {
          ...updated[idx],
          summary: summaryText,
          error: !res.ok ? (data.error || "Failed to generate summary.") : "",
          loading: false,
        };
        return updated;
      });
      // Persist summary in MongoDB if successful
      if (res.ok && data.summaries) {
        const summaryText = Object.entries(data.summaries)
          .map(([page, summary]) => `Page ${page}:\n${summary}`)
          .join("\n\n");
        await fetch("/api/actions/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name + " (Abstractive Summary)", content: summaryText })
        });
      }
    } catch {
      setResults((prev) => {
        const idx = prev.findIndex(r => r.loading && r.filename === file.name);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          summary: "",
          error: "Server error. Please try again later.",
          loading: false,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-home">
      <Navbar active="summarization">
        <Link to="/summarization" className="nav-link">Summarization</Link>
        <Link to="/abstractive-summarization" className="nav-link nav-active">Abstractive Summarization</Link>
        <Link to="/extractive-summarization" className="nav-link">Extractive Summarization</Link>
      </Navbar>
      <main className="home-main">
        <section className="main-section image2text-section">
          <div className="image2text-left">
            <form className="file-uploader-card glassmorph-uploader" onSubmit={handleUpload}>
              <div className="uploader-illustration">
                <span role="img" aria-label="upload" style={{fontSize: '3.5rem'}}>🧠</span>
              </div>
              <h2>Abstractive Summarization</h2>
              <input type="file" className="file-input fancy-input" onChange={handleFileChange} />
              <button type="submit" className="suggestion-submit fancy-btn" disabled={loading || !file} style={{marginTop: '1rem'}}>
                {loading ? (
                  <>
                    <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                  </>
                ) : (
                  <>
                    <span role="img" aria-label="magic">✨</span> Summarize
                  </>
                )}
              </button>
              <p className="file-uploader-desc">Upload a document to generate an abstractive summary.</p>
              {error && <div className="error-msg">{error}</div>}
            </form>
          </div>
          <div className="image2text-right">
            <h2 className="output-section-title">Output</h2>
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`output-card glassmorph-output output-card-collapsible${result.expanded ? ' expanded' : ''}`}
                onClick={() => {
                  setResults((prev) => prev.map((r, i) => i === idx ? { ...r, expanded: !r.expanded } : r));
                }}
                style={{cursor: 'pointer', marginBottom: '1.2rem'}}
                title={result.expanded ? 'Click to collapse' : 'Click to expand'}
              >
                <div className="output-card-header">
                  <span className="output-card-icon" role="img" aria-label="summary">🧠</span>
                  <span className="output-card-filename">{result.filename}</span>
                  <span className="output-card-expand-icon">{result.expanded ? '▲' : '▼'}</span>
                </div>
                {result.expanded && (
                  <div className="output-textarea output-textarea-expanded">
                    {result.loading ? (
                      <div style={{color: '#3aafa9', fontWeight: 600, textAlign: 'center'}}>
                        <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                      </div>
                    ) : result.summary ? (
                      <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0}}>{result.summary}</pre>
                    ) : result.error ? (
                      <span style={{color: '#d90429'}}>{result.error}</span>
                    ) : (
                      <span style={{color: '#888'}}>No summary generated yet.</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AbstractiveSummarization;