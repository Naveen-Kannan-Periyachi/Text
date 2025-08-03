import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TextExtraction from "./components/TextExtraction";
import ImageToText from "./components/ImageToText";
import PdfToText from "./components/PdfToText";
import DocToText from "./components/DocToText";
import ExcelToText from "./components/ExcelToText";
import Navbar from "./components/Navbar";
import FeatureCard from "./components/FeatureCard";
import './App.css';
import Summarization from "./components/Summarization";
import Translation from "./components/Translation";
import DocAnalyze from "./components/DocAnalyze";
import AbstractiveSummarization from "./components/AbstractiveSummarization";
import ExtractiveSummarization from "./components/ExtractiveSummarization";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { GoogleOAuthProvider } from '@react-oauth/google';

function Home({ user, onLogout }) {
  return (
    <div className="app-home">
      <Navbar active="home" user={user} onLogout={onLogout}>
        <Link to="/text-extraction" className="nav-link nav-active">Text Extraction</Link>
        <Link to="/doc-analyze" className="nav-link">Doc Analyze</Link>
        <Link to="/summarization" className="nav-link">Summarization</Link>
        <Link to="/translation" className="nav-link">Translation</Link>
        {!user && <Link to="/login" className="nav-link">Login</Link>}
        {!user && <Link to="/signup" className="nav-link nav-signup">Sign Up</Link>}
      </Navbar>
      <main className="home-main">
        <section className="main-section">
          <h1 className="fancy-title">Welcome{user ? `, ${user.name || user.email}` : ''} to <span>OCR Project</span></h1>
          <div className="project-description card-glass">
            <p>
              <b>OCR Project</b> is your all-in-one platform for seamless, intelligent document processing. Using advanced Optical Character Recognition (OCR), our system extracts text from images, PDFs, Word, and Excel files with remarkable accuracy.
            </p>
            <p>
              <b>Analyze Documents:</b> Unlock insights with robust document analysis tools. Organize, understand, and manage your files with ease—extract key information or analyze structure in just a few clicks.
            </p>
            <p>
              <b>Summarize Instantly:</b> Turn lengthy documents into concise, meaningful summaries. Our AI-powered summarization engine saves you time and boosts productivity.
            </p>
            <p>
              <b>Translate Effortlessly:</b> Break language barriers with built-in translation. Convert extracted or summarized text into multiple languages for global collaboration.
            </p>
            <p>
              <b>User-Friendly & Secure:</b> Enjoy a modern interface, smooth navigation, and secure authentication. Perfect for businesses, educators, and anyone looking to automate and enhance document workflows.
            </p>
            <p>
              <b>Collaboration Ready:</b> Our platform is built for teams. Share documents, collaborate on analysis, and manage access with role-based permissions, ensuring your data stays organized and secure.
            </p>
            <p>
              <b>Cloud Integration:</b> Easily connect with popular cloud storage providers to import and export documents. Access your files from anywhere and keep your workflow uninterrupted.
            </p>
            <p>
              <b>Continuous Improvement:</b> We are committed to innovation. Our team regularly updates the platform with new features, improved AI models, and enhanced security to keep you ahead in document automation.
            </p>
            <p>
              <b>Support & Community:</b> Get help when you need it with our responsive support team and active user community. Share feedback, request features, and help shape the future of OCR Project.
            </p>
          </div>
          <div className="features-section">
            <FeatureCard icon="📄" title="Doc Analyze" description="Analyze documents for structure, key information, and content insights. Unlock the power of automated document understanding for smarter workflows." to="/doc-analyze" />
            <FeatureCard icon="📝" title="Summarization" description="Condense lengthy documents into concise, meaningful summaries using advanced AI. Save time and focus on what matters most." to="/summarization" />
            <FeatureCard icon="🔍" title="Text Extraction" description="Extract text from images, PDFs, Word, and Excel files with high accuracy. Turn any document into editable, searchable content." to="/text-extraction" />
            <FeatureCard icon="🌐" title="Translation" description="Translate extracted or summarized text into multiple languages instantly. Collaborate globally without language barriers." to="/translation" />
          </div>
          <FeedbackForm user={user} />
        </section>
      </main>
    </div>
  );
}
import FeedbackForm from "./components/FeedbackForm";

function App() {
  const [user, setUser] = useState(null);
  const handleLogout = () => {
    setUser(null);
    window.location.href = "/";
  };
  return (
    <GoogleOAuthProvider clientId="1036320454589-nvsj2245l1c5ku2pug221kddg9ugrfsv.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
          <Route path="/text-extraction" element={<TextExtraction />} />
          <Route path="/image-to-text" element={<ImageToText />} />
          <Route path="/pdf-to-text" element={<PdfToText />} />
          <Route path="/doc-to-text" element={<DocToText />} />
          <Route path="/excel-to-text" element={<ExcelToText />} />
          <Route path="/summarization" element={<Summarization />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/doc-analyze" element={<DocAnalyze />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/abstractive-summarization" element={<AbstractiveSummarization />} />
          <Route path="/extractive-summarization" element={<ExtractiveSummarization />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
