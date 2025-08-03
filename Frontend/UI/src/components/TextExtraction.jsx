import React from "react";
import Navbar from "./Navbar";
import FeatureCard from "./FeatureCard";
import { Link } from "react-router-dom";
import "../App.css";

function TextExtraction() {
  return (
    <div className="app-home">
      <Navbar active="text-extraction">
        <Link to="/text-extraction" className="nav-link nav-active">Text Extraction</Link>
        <Link to="/image-to-text" className="nav-link">Images</Link>
        <Link to="/pdf-to-text" className="nav-link">PDF</Link>
        <Link to="/doc-to-text" className="nav-link">Doc</Link>
        <Link to="/excel-to-text" className="nav-link">Excel</Link>
      </Navbar>
      <main className="home-main">
        <section className="main-section">
          <h1 className="fancy-title">Text Extraction</h1>
          <div className="project-description card-glass">
            <p>
              <b>Text Extraction</b> is the process of automatically retrieving text from various file formats such as images, PDFs, Word documents, and Excel sheets. Our OCR-powered platform ensures high accuracy and efficiency, making it easy to convert any document into editable, searchable content.
            </p>
            <p>
              Whether you are digitizing old records, extracting data from scanned forms, or simply converting files for easier access, our solution streamlines the workflow and saves valuable time. With support for multiple file types and advanced AI models, you can trust our platform to handle your text extraction needs with speed and precision.
            </p>
            <p>
              Extracting text from documents enables automation, data analysis, and accessibility. Our platform is designed to help you unlock the value in your files, making information easy to search, edit, and share.
            </p>
          </div>
          <div className="features-section">
            <FeatureCard icon="🖼️" title="Image to Text" description="Extract text from JPG, PNG, and other image formats using advanced OCR algorithms." to="/image-to-text" />
            <FeatureCard icon="📄" title="PDF to Text" description="Convert scanned or digital PDFs into editable, searchable text with high accuracy." to="/pdf-to-text" />
            <FeatureCard icon="📝" title="Doc to Text" description="Extract content from Word documents, making data processing and analysis effortless." to="/doc-to-text" />
            <FeatureCard icon="📊" title="Excel to Text" description="Extract content from Excel files for easy data conversion and automation." to="/excel-to-text" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default TextExtraction;
