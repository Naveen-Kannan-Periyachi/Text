import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "../App.css";

function DocAnalyze() {
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      // For consistency, use the same pattern as other features
      // But /analyze-document/ expects no file in current backend, so let's check backend logic
      // If needed, update backend to accept file upload
      const res = await fetch("http://localhost:8000/analyze-document/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.analysis) {
        setResult(data.analysis);
        // Persist analysis in MongoDB
        await fetch("/api/actions/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file?.name ? file.name + " (Analysis)" : "Document Analysis", content: data.analysis })
        });
      } else {
        setError(data.error || "Failed to analyze document.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-home">
      <Navbar active="doc-analyze">
        <Link to="/doc-analyze" className="nav-link nav-active">Document Analysis</Link>
      </Navbar>
      <main className="home-main">
        <section className="main-section">
          <h1 className="fancy-title">Document Analysis</h1>
          <div className="project-description card-glass">
            <p>
              <b>Document Analysis</b> helps you unlock insights from your documents. Analyze structure, extract key information, and understand content with advanced AI-powered tools.
            </p>
            <p>
              Whether you need to process research papers, business reports, or any other documents, our platform provides fast and accurate analysis to streamline your workflow.
            </p>
            <p>
              Get started by uploading a document and see the analysis results instantly.
            </p>
          </div>
          <div className="processing-session" style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="image2text-left">
              <form className="file-uploader-card glassmorph-uploader" onSubmit={handleUpload}>
                <div className="uploader-illustration">
                  <span role="img" aria-label="analyze" style={{fontSize: '3.5rem'}}>📄</span>
                </div>
                <h2>Analyze Document</h2>
                <input type="file" className="file-input fancy-input" onChange={handleFileChange} />
                <button type="submit" className="suggestion-submit fancy-btn" disabled={loading || !file} style={{marginTop: '1rem'}}>
                  {loading ? (
                    <>
                      <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                    </>
                  ) : (
                    <>
                      <span role="img" aria-label="magic">✨</span> Analyze
                    </>
                  )}
                </button>
                <p className="file-uploader-desc">Select a file to analyze its structure and content.</p>
                {error && <div className="error-msg">{error}</div>}
              </form>
            </div>
            <div className="image2text-right">
              <h2 className="output-section-title">Output</h2>
              <div className="output-card glassmorph-output output-card-collapsible expanded">
                <div className="output-card-header">
                  <span className="output-card-icon" role="img" aria-label="file">🗂️</span>
                  <span className="output-card-filename">{file ? file.name : "No file uploaded"}</span>
                  <span className="output-card-expand-icon">▲</span>
                </div>
                <div className="output-textarea output-textarea-expanded">
                  {loading ? (
                    <div style={{color: '#3aafa9', fontWeight: 600, textAlign: 'center'}}>
                      <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                    </div>
                  ) : result ? (
                    <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0}}>{result}</pre>
                  ) : error ? (
                    <span style={{color: '#d90429'}}>{error}</span>
                  ) : (
                    <span style={{color: '#888'}}>Analysis results will appear here.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DocAnalyze;
