import React from "react";
import Navbar from "./Navbar";
import FeatureCard from "./FeatureCard";
import { Link } from "react-router-dom";
import "../App.css";

function Summarization() {
  return (
    <div className="app-home">
      <Navbar active="summarization">
        <Link to="/abstractive-summarization" className="nav-link">Abstractive Summarization</Link>
        <Link to="/extractive-summarization" className="nav-link">Extractive Summarization</Link>
      </Navbar>
      <main className="home-main">
        <section className="main-section">
          <h1 className="fancy-title">Summarization</h1>
          <div className="project-description card-glass">
            <div>
              <b>Summarization</b> transforms lengthy documents into concise, meaningful summaries. Choose between <b>abstractive</b> (AI-generated rephrasing) and <b>extractive</b> (key sentence selection) methods to suit your needs.
            </div>
            <div>
              Our platform leverages state-of-the-art AI models to deliver accurate, context-aware summaries. Whether you need a quick overview or a detailed abstract, our summarization tools help you save time and focus on what matters most.
            </div>
            <div>
              Summarization is ideal for research, business reports, legal documents, and more. Streamline your workflow and boost productivity with instant, high-quality summaries.
            </div>
          </div>

          {/* Feature Cards with definitions inside */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: '3rem', margin: '2.5rem 0', flexWrap: 'wrap' }}>
            <FeatureCard
              icon="🧠"
              title="Abstractive Summarization"
              description={
                <>
                  <div style={{ fontWeight: 500, marginBottom: 6 }}>AI-powered rephrasing for human-like, context-aware summaries.</div>
                  <div style={{ fontSize: '1rem', color: '#23263a', opacity: 0.85 }}>
                    Generates new sentences that capture the meaning of the original text.
                  </div>
                </>
              }
              to="/abstractive-summarization"
            />
            <FeatureCard
              icon="📑"
              title="Extractive Summarization"
              description={
                <>
                  <div style={{ fontWeight: 500, marginBottom: 6 }}>Selects the most important sentences for a quick, factual summary.</div>
                  <div style={{ fontSize: '1rem', color: '#23263a', opacity: 0.85 }}>
                    Selects and combines the most important sentences from the original text to create a concise, factual summary.
                  </div>
                </>
              }
              to="/extractive-summarization"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Summarization;
