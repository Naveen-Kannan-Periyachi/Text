import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "../App.css";

function Translation() {
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [results, setResults] = React.useState([]); // { filename, output, error, loading, expanded }

  const LANGUAGES = [
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' },
    { code: 'en', name: 'English' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
  ];

  // Change to single-select dropdown, default to Tamil
  const [selectedLanguages, setSelectedLanguages] = React.useState(['ta']);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  // Single-select dropdown handler
  const handleLanguageChange = (e) => {
    setSelectedLanguages([e.target.value]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || selectedLanguages.length === 0) {
      setError("Please select a file and at least one language.");
      return;
    }
    setLoading(true);
    setError("");
    setResults((prev) => [
      ...prev,
      {
        filename: file.name,
        output: {}, // { lang: translation }
        error: "",
        loading: true,
        expanded: true,
        languages: [...selectedLanguages],
      },
    ]);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language_codes", selectedLanguages.join(","));
    try {
      const res = await fetch("http://localhost:8000/translate/", {
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
          output: res.ok && data.translations ? data.translations : {},
          error: !res.ok ? (data.error || "Failed to translate text.") : "",
          loading: false,
        };
        return updated;
      });
      // Persist translation in MongoDB if successful
      if (res.ok && data.translations) {
        for (const [lang, translation] of Object.entries(data.translations)) {
          await fetch("/api/actions/document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name + ` (Translation - ${lang})`, content: translation })
          });
        }
      }
    } catch {
      setResults((prev) => {
        const idx = prev.map((r, i) => ({...r, i})).reverse().find(r => r.loading && r.filename === file.name)?.i;
        if (idx === undefined) return prev;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          output: {},
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
      <Navbar active="translation">
        <Link to="/translation" className="nav-link nav-active">Translator</Link>
      </Navbar>
      <main className="home-main">
        <section className="main-section">
          <h1 className="fancy-title">Translator</h1>
          <div className="project-description card-glass">
            <p>
              <b>Translation</b> enables you to break language barriers by converting text from one language to another. Our platform supports a wide range of languages, making global communication seamless and efficient.
            </p>
            <p>
              Whether you need to translate extracted text, summarized content, or entire documents, our AI-powered translation engine delivers fast and accurate results. Perfect for international business, research, and collaboration.
            </p>
            <p>
              Experience the convenience of instant translation and open up new opportunities for cross-cultural understanding and cooperation.
            </p>
          </div>
          <div className="processing-session" style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="image2text-left">
              <form className="file-uploader-card glassmorph-uploader" onSubmit={handleUpload}>
                <div className="uploader-illustration">
                  <span role="img" aria-label="translate" style={{fontSize: '3.5rem'}}>🌐</span>
                </div>
                <h2>Translate File</h2>
                <input type="file" className="file-input fancy-input" onChange={handleFileChange} />
                <div style={{margin: '1rem 0'}}>
                  <label style={{fontWeight: 600}}>Select target language:</label>
                  <select
                    value={selectedLanguages[0]}
                    onChange={handleLanguageChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      minHeight: '2.5rem',
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                      border: '1.5px solid #b2f7ef',
                      fontSize: '1.1rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      background: '#23263a',
                      color: '#fff',
                      outline: 'none',
                      transition: 'border 0.2s',
                    }}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="suggestion-submit fancy-btn" disabled={loading || !file || selectedLanguages.length === 0} style={{marginTop: '1rem'}}>
                  {loading ? (
                    <>
                      <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                    </>
                  ) : (
                    <>
                      <span role="img" aria-label="magic">✨</span> Translate
                    </>
                  )}
                </button>
                <p className="file-uploader-desc">Select a file and a target language to translate its content. (Default: Tamil)</p>
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
                    <span className="output-card-icon" role="img" aria-label="file">🗂️</span>
                    <span className="output-card-filename">{result.filename}</span>
                    <span className="output-card-expand-icon">{result.expanded ? '▲' : '▼'}</span>
                  </div>
                  {result.expanded && (
                    <div className="output-textarea output-textarea-expanded">
                      {result.loading ? (
                        <div style={{color: '#3aafa9', fontWeight: 600, textAlign: 'center'}}>
                          <span className="loader" style={{marginRight: '0.7rem', verticalAlign: 'middle'}}></span> Processing...
                        </div>
                      ) : result.error ? (
                        <span style={{color: '#d90429'}}>{result.error}</span>
                      ) : Object.keys(result.output).length > 0 ? (
                        <div>
                          {Object.entries(result.output).map(([lang, translation]) => (
                            <div key={lang} style={{marginBottom: '1rem', position: 'relative'}}>
                              <b>{LANGUAGES.find(l => l.code === lang)?.name || lang}:</b>
                              <div style={{display: 'flex', gap: '0.7rem', marginBottom: '0.3rem'}}>
                                <button
                                  className="output-btn output-copy-btn"
                                  type="button"
                                  title="Copy to clipboard"
                                  onClick={e => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(translation);
                                  }}
                                >📋 Copy</button>
                                <button
                                  className="output-btn output-download-btn"
                                  type="button"
                                  title="Download as TXT"
                                  onClick={e => {
                                    e.stopPropagation();
                                    const blob = new Blob([translation], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${result.filename || 'output'}_${lang}.txt`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                  }}
                                >⬇ Download</button>
                              </div>
                              <pre className={typeof translation === 'string' && (translation.trim().startsWith('{') || translation.trim().startsWith('[')) ? 'output-pre code-output' : 'output-pre'} style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, maxHeight: '180px', overflowY: 'auto', resize: 'vertical'}}>{translation}</pre>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{color: '#888', textAlign: 'center', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span role="img" aria-label="output">📝</span> No output yet. Upload and extract to see results.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Translation;
