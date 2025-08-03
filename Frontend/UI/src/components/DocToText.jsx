import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "../App.css";

function DocToText() {
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [results, setResults] = React.useState([]); // { filename, output, error, loading, expanded }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    setResults((prev) => [
      ...prev,
      {
        filename: file.name,
        output: "",
        error: "",
        loading: true,
        expanded: true,
      },
    ]);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", "docx");
    try {
      const res = await fetch("http://localhost:8000/extract-text/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults((prev) => {
        const idx = prev.map((r, i) => ({...r, i})).reverse().find(r => r.loading && r.filename === file.name)?.i;
        if (idx === undefined) return prev;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          output: res.ok && data.text ? data.text : "",
          error: !res.ok ? (data.error || "Failed to extract text.") : "",
          loading: false,
        };
        return updated;
      });
      // Persist document info in MongoDB if extraction succeeded
      if (res.ok && data.text) {
        await fetch("/api/actions/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, content: data.text })
        });
      }
    } catch {
      setResults((prev) => {
        const idx = prev.map((r, i) => ({...r, i})).reverse().find(r => r.loading && r.filename === file.name)?.i;
        if (idx === undefined) return prev;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          output: "",
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
      <Navbar active="text-extraction">
        <Link to="/text-extraction" className="nav-link">Text Extraction</Link>
        <Link to="/image-to-text" className="nav-link">Images</Link>
        <Link to="/pdf-to-text" className="nav-link">PDF</Link>
        <Link to="/doc-to-text" className="nav-link nav-active">Doc</Link>
        <Link to="/excel-to-text" className="nav-link">Excel</Link>
      </Navbar>
      <main className="home-main">
        <section className="main-section image2text-section">
          <div className="image2text-left">
            <form className="file-uploader-card glassmorph-uploader" onSubmit={handleUpload}>
              <div className="uploader-illustration">
                <span role="img" aria-label="upload" style={{fontSize: '3.5rem'}}>📄</span>
              </div>
              <h2>Docx to Text</h2>
              <input type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="file-input fancy-input" onChange={handleFileChange} />
              <button type="submit" className="suggestion-submit fancy-btn" disabled={loading || !file} style={{marginTop: '1rem'}}>
                {loading ? (
                  <>
                    <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                  </>
                ) : (
                  <>
                    <span role="img" aria-label="magic">✨</span> Extract Text
                  </>
                )}
              </button>
              <p className="file-uploader-desc">Select a DOCX file to extract text from.</p>
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
                  <span className="output-card-icon" role="img" aria-label="file">📄</span>
                  <span className="output-card-filename">{result.filename}</span>
                  <span className="output-card-expand-icon">{result.expanded ? '▲' : '▼'}</span>
                </div>
                {result.expanded && (
                  <div className="output-textarea output-textarea-expanded">
                    {result.loading ? (
                      <div style={{color: '#3aafa9', fontWeight: 600, textAlign: 'center'}}>
                        <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                      </div>
                    ) : result.output ? (
                      <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0}}>{result.output}</pre>
                    ) : result.error ? (
                      <span style={{color: '#d90429'}}>{result.error}</span>
                    ) : (
                      <span style={{color: '#888'}}>No text extracted yet.</span>
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

export default DocToText;
