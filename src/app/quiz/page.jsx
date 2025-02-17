"use client";
import { useState } from 'react';
import { Timer, Award, Crown, Star, AlertCircle } from 'lucide-react';
import "./style.css";
import Link from 'next/link';

export default function QuizApp() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      "question": "Which social media platform has the strongest fact-checking policy?",
      "options": ["TweetBook", "InstaTok", "FactCheck+", "SocialMedia Pro"],
      "correct": 2,
      "explanation": "FactCheck+ implements AI-powered real-time verification."
    },
    {
      "question": "What is a deepfake?",
      "options": [
        "A type of social media filter",
        "AI-generated synthetic media that manipulates images, videos, or audio",
        "A new video game genre",
        "A cybersecurity tool"
      ],
      "correct": 1,
      "explanation": "Deepfakes use AI to create realistic but fake images, videos, or audio, often used to spread misinformation."
    },
    {
      "question": "Which of the following is a common sign of a deepfake video?",
      "options": [
        "Perfect lip-syncing",
        "Unnatural eye movements or blinking",
        "High-resolution visuals",
        "Background music"
      ],
      "correct": 1,
      "explanation": "Unnatural eye movements or blinking are often signs of a deepfake, as AI struggles to replicate these subtle human behaviors."
    },
    {
      "question": "What is the primary goal of misinformation campaigns?",
      "options": [
        "To entertain users",
        "To spread accurate information",
        "To manipulate public opinion or cause confusion",
        "To promote new technologies"
      ],
      "correct": 2,
      "explanation": "Misinformation campaigns aim to manipulate public opinion, sow confusion, or influence political and social outcomes."
    },
    {
      "question": "Which technology is commonly used to detect deepfake videos?",
      "options": [
        "Blockchain",
        "Natural Language Processing (NLP)",
        "Error Level Analysis (ELA)",
        "Augmented Reality (AR)"
      ],
      "correct": 2,
      "explanation": "Error Level Analysis (ELA) is a technique used to detect inconsistencies in images or videos, often revealing deepfakes."
    },
    {
      "question": "What is the role of NLP in misinformation detection?",
      "options": [
        "To analyze and classify text for credibility",
        "To generate fake news articles",
        "To create deepfake videos",
        "To encrypt sensitive data"
      ],
      "correct": 0,
      "explanation": "Natural Language Processing (NLP) is used to analyze and classify text, helping to identify fake news or misleading content."
    },
    {
      "question": "Which of the following is NOT a fact-checking organization?",
      "options": [
        "Snopes",
        "PolitiFact",
        "FactCheck.org",
        "DeepfakeAI"
      ],
      "correct": 3,
      "explanation": "DeepfakeAI is not a fact-checking organization; it is a term associated with AI-generated synthetic media."
    },
    {
      "question": "What is the purpose of reverse image search in misinformation detection?",
      "options": [
        "To create new images",
        "To verify the authenticity of an image by finding its original source",
        "To generate deepfake images",
        "To compress image files"
      ],
      "correct": 1,
      "explanation": "Reverse image search helps verify the authenticity of an image by tracing it back to its original source or identifying manipulated versions."
    },
    {
      "question": "Which of the following is a red flag for fake news?",
      "options": [
        "Credible sources and citations",
        "Emotional language and sensational headlines",
        "Balanced reporting",
        "Authoritative tone"
      ],
      "correct": 1,
      "explanation": "Fake news often uses emotional language and sensational headlines to grab attention and spread quickly."
    },
    {
      "question": "What is the best way to verify if a news article is credible?",
      "options": [
        "Share it on social media immediately",
        "Check multiple reputable sources for confirmation",
        "Trust the headline without reading the article",
        "Assume it's true if it aligns with your beliefs"
      ],
      "correct": 1,
      "explanation": "Cross-checking information with multiple reputable sources is the best way to verify the credibility of a news article."
    }
    // Add more questions as needed
  ];

  const leaderboard = [
    { username: "TruthSeeker", points: 980, rank: 1 },
    { username: "FactMaster", points: 850, rank: 2 },
    { username: "InfoHunter", points: 720, rank: 3 },
    { username: "NewsGuru", points: 650, rank: 4 },
    { username: "MediaPro", points: 580, rank: 5 },
    { username: "DataSleuth", points: 490, rank: 6 },
    { username: "InfoSage", points: 420, rank: 7 }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 10);
    }
    setShowExplanation(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
  };

  return (
    <div className='h-screen w-screen  bg-[#b3b3b3]'>
      <header>
        <div className="logo">
        <AlertCircle size={24} />
        <span>Satya</span>
        </div>
        <nav>
            <Link href="/Fact-checking" className="active">Fact-Checking</Link>
            <Link href="/main_page">Analyze</Link>
            
            <Link href="/user_reporting">User Reporting</Link>
            <Link href="/profile">Profile</Link>
        </nav>
  </header>
    <div className="container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz
        </button>
        <button 
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'quiz' ? (
        <div className="quiz-container">
          <div className="quiz-header">
            <div className="timer">
              <Timer size={20} />
              Time: 2:30
            </div>
            <div className="score">
              <Award size={20} />
              Score: {score}
            </div>
          </div>

          <div className="question-container">
            <h2>Question {currentQuestion + 1}/10</h2>
            <p>{questions[currentQuestion].question}</p>

            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`option ${
                    selectedAnswer !== null && index === questions[currentQuestion].correct ? 'correct' : ''
                  } ${
                    selectedAnswer === index && index !== questions[currentQuestion].correct ? 'wrong' : ''
                  }`}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="explanation">
                <p>{questions[currentQuestion].explanation}</p>
              </div>
            )}

            <button className="reset-button" onClick={resetQuiz}>
              Restart Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="leaderboard-container">
          <h2><Crown size={24} /> Top Performers</h2>
          <div className="podium">
        {/* Top 3 Podium */}
        <div className="top-three">
          <div className="podium-place second">
            <Crown size={20} className="medal silver" />
            <div className="player-info">
              <span className="username">{leaderboard[1].username}</span>
              <span className="points">{leaderboard[1].points} pts</span>
            </div>
            <div className="platform silver">2</div>
          </div>
          <div className="podium-place first">
            <Crown size={24} className="medal gold" />
            <div className="player-info">
              <span className="username">{leaderboard[0].username}</span>
              <span className="points">{leaderboard[0].points} pts</span>
            </div>
            <div className="platform gold">1</div>
          </div>
          <div className="podium-place third">
            <Crown size={20} className="medal bronze" />
            <div className="player-info">
              <span className="username">{leaderboard[2].username}</span>
              <span className="points">{leaderboard[2].points} pts</span>
            </div>
            <div className="platform bronze">3</div>
          </div>
        </div>
        
        {/* Rest of leaderboard */}
        <div className="other-ranks">
          {leaderboard.slice(3).map((player, index) => (
            <div key={player.rank} className="rank-item">
              <span className="rank-number">{player.rank}</span>
              <span className="username">{player.username}</span>
              <span className="points">{player.points} pts</span>
            </div>
          ))}
        </div>
      </div>
        </div>
      )}

      
    </div>
    </div>
  );
}