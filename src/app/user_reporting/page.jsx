"use client";
import "./style.css";
import { useState, useRef } from 'react';
import { Flag, AlertTriangle, X, Image, Video, AlertCircle } from 'lucide-react';
import Link from "next/link";  // Correct import

export default function ReportSystem() {
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const fileRefs = {
    image: useRef(null),
    video: useRef(null)
  };
  const [files, setFiles] = useState({
    image: null,
    video: null
  });

  const pastReports = [
    { id: 1, content: "example.com/news1", type: "url", status: "fake", date: "2024-02-15" },
    { id: 2, content: "example.com/news2", type: "url", status: "true", date: "2024-02-14" }
  ];

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (file) setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="h-screen w-screen bg-[#b3b3b3]">
      <header>
        <div className="logo">
          <AlertCircle size={24} />
          <span>Satya</span>
        </div>
        <nav>
          <Link href="/Fact-Checking" className="active">Fact Cheking</Link>
          <Link href="/main_page">Analyze</Link>
          <Link href="/quiz">Quiz</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </header>

      <div className="container">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="input-group">
            <input
              type="url"
              placeholder="Enter URL to report"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="file-inputs">
            <button type="button" onClick={() => fileRefs.image.current?.click()} className="upload-btn">
              <Image size={20} />
              {files.image?.name || "Upload Image"}
            </button>
            <input
              type="file"
              ref={fileRefs.image}
              onChange={(e) => handleFileChange('image', e)}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <button type="button" onClick={() => fileRefs.video.current?.click()} className="upload-btn">
              <Video size={20} />
              {files.video?.name || "Upload Video"}
            </button>
            <input
              type="file"
              ref={fileRefs.video}
              onChange={(e) => handleFileChange('video', e)}
              accept="video/*"
              style={{ display: 'none' }}
            />
          </div>

          <button type="submit" className="flag-button">
            <Flag size={20} />
            Flag this as fake
          </button>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
              <AlertTriangle size={48} className="modal-icon" />
              <h2>Thank you for your contribution!</h2>
              <p>We will further look into that.</p>
            </div>
          </div>
        )}

        <div className="past-reports">
          <h3>Past Reports</h3>
          <div className="reports-list">
            {pastReports.map(report => (
              <div key={report.id} className={`report-item ${report.status}`}>
                <span className="report-content">{report.content}</span>
                <span className="report-status">{report.status}</span>
                <span className="report-date">{report.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
