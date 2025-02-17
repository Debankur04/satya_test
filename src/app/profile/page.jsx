// profile.js
"use client";
import { useState, useRef } from 'react';
import { UserCircle, Award, History, Edit2, Save, X, AlertCircle } from 'lucide-react';
import "./style.css";
import Link from 'next/link';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    imageUrl: "/api/placeholder/150/150",
    reports: [
      { id: 1, content: "https://example.com/news1", type: "url", verdict: "fake" },
      { id: 2, content: "/api/placeholder/200/200", type: "image", verdict: "real" }
    ],
    achievements: {
      score: 850,
      rank: 12,
      quizzesTaken: 25,
      accuracy: "85%"
    }
  });

  const fileInputRef = useRef(null);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedUser(prev => ({ ...prev, imageUrl }));
    }
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div>
    <header>
        <div className="logo">
        <AlertCircle size={24} />
        <span>Satya</span>
        </div>
        <nav>
            <Link href="/Fact-Checking" className="active">Fact-Checking</Link>
            <Link href="/main_page">Analyze</Link>
            <Link href="/quiz">Quiz</Link>
            <Link href="/user_reporting">User Reporting</Link>
        </nav>
  </header>
    <div className="profile-container">
      <div className="user-header">
        <div className="image-container">
          <img 
            src={isEditing ? editedUser.imageUrl : user.imageUrl} 
            alt="Profile" 
            className="profile-image" 
            onClick={isEditing ? handleImageClick : undefined}
            style={isEditing ? { cursor: 'pointer' } : {}}
          />
          {isEditing && (
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              style={{ display: 'none' }}
            />
          )}
        </div>
        <div className="user-info">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedUser.name}
                onChange={e => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="edit-input"
              />
              <input
                type="email"
                value={editedUser.email}
                onChange={e => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="edit-input"
              />
            </>
          ) : (
            <>
              <h1>{user.name}</h1>
              <p className="email">{user.email}</p>
            </>
          )}
        </div>
        <div className="edit-buttons">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="icon-button save">
                <Save size={20} />
              </button>
              <button onClick={handleCancel} className="icon-button cancel">
                <X size={20} />
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="icon-button edit">
              <Edit2 size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="cards-container">
      <div className="card">
          <div className="card-header">
            <History size={24} />
            <h2>Misinformation Reports & History</h2>
          </div>
          <div className="reports-list">
            {user.reports.map(report => (
              <div key={report.id} className="report-item">
                {report.type === 'image' ? (
                  <img src={report.content} alt="Report" className="report-image" />
                ) : (
                  <a href={report.content} className="report-link">{report.content}</a>
                )}
                <span className={`verdict ${report.verdict}`}>{report.verdict}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <Award size={24} />
            <h2>Achievements</h2>
          </div>
          <div className="achievements-content">
            <div className="achievement-item">
              <h3>Quiz Score</h3>
              <p>{user.achievements.score}</p>
            </div>
            <div className="achievement-item">
              <h3>Rank</h3>
              <p>#{user.achievements.rank}</p>
            </div>
            <div className="achievement-item">
              <h3>Quizzes Taken</h3>
              <p>{user.achievements.quizzesTaken}</p>
            </div>
            <div className="achievement-item">
              <h3>Accuracy</h3>
              <p>{user.achievements.accuracy}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
  );
}