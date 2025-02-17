<<<<<<< HEAD
import { AlertCircle } from 'lucide-react'
import React from 'react'
import "./style.css"


const navbar = () => {
  return (
    <header>
        <div className="logo">
        <AlertCircle size={24} />
        <span>TruthSeeker</span>
        </div>
        <nav>
            <Link href="/" className="active">Home</Link>
            <Link href="/main_page">Analyze</Link>
            <Link href="/quiz">Quiz</Link>
            <Link href="/user_reporting">User Reporting</Link>
        </nav>
  </header>
  )
}

=======
import { AlertCircle } from 'lucide-react'
import React from 'react'
import "./style.css"


const navbar = () => {
  return (
    <header>
        <div className="logo">
        <AlertCircle size={24} />
        <span>TruthSeeker</span>
        </div>
        <nav>
            <Link href="/" className="active">Home</Link>
            <Link href="/main_page">Analyze</Link>
            <Link href="/quiz">Quiz</Link>
            <Link href="/user_reporting">User Reporting</Link>
        </nav>
  </header>
  )
}

>>>>>>> 77e3ee8 (Backend Fix)
export default navbar