"use client";
import Link from "next/link";
import "./style.css";
import { Search, ArrowRight, AlertCircle } from 'lucide-react';

export default function Home() {
  const trendingCases = [
    {
      id: 1,
      title: "Viral Social Media Post about Climate Change",
      status: "Debunked",
      date: "2024-02-16"
    },
    {
      id: 2,
      title: "Recent Health Advice Circulating on WhatsApp",
      status: "Misleading",
      date: "2024-02-15"
    },
    {
      id: 3,
      title: "Celebrity Quote About Political Event",
      status: "False Context",
      date: "2024-02-14"
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <header>
        <div className="logo">
          <AlertCircle size={24} />
          <span>Satya</span>
        </div>
        <nav>
          <Link href={"/auth/signin"}><button className="login-btn">Login</button></Link>
          <Link href={"/auth/signup"}><button className="signup-btn">Sign Up</button></Link>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        
        <section className="hero-section">
          
          <h1>Verify Before You Share</h1>
          <p>Use AI-powered tools to detect misinformation in news and social media</p>
          
          <div className="search-container">
            <div className="search-bar">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Enter a news URL or paste text for verification"
              />
            </div>
            <button className="analyze-btn">
            <Link href={"/auth/signup"}><div className="signup-btn">Analyze</div></Link>
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        <section className="trending-section">
          <h2>Recent Trending Misinformation Cases</h2>
          <div className="cases-grid">
            {trendingCases.map(item => (
              <div key={item.id} className="case-card">
                <div className="case-header">
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                  <span className="date">{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <a href={`/case/${item.id}`} className="read-more">
                  Read Analysis <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/contact">Contact Us</a>
          </div>
          <p className="copyright">© 2024 TruthSeeker. All rights reserved.</p>
        </div>
      </footer>

      
    </div>
  );
}
