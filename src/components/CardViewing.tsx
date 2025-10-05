import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

// 3D scene moved to ViewingScene in UnifiedCanvas

const CardContent = ({ 
  theme, 
  meaning, 
  questions, 
  actions, 
  onNext 
}: { 
  theme: string
  meaning?: string
  questions?: string[]
  actions?: string[]
  onNext: (section: string) => void
}) => {
  const [currentSection, setCurrentSection] = useState<'meaning' | 'questions' | 'actions'>('meaning')
  
  const nextSection = () => {
    if (currentSection === 'meaning') {
      setCurrentSection('questions')
      onNext('questions')
    } else if (currentSection === 'questions') {
      setCurrentSection('actions')
      onNext('actions')
    }
  }
  
  const renderContent = () => {
    switch (currentSection) {
      case 'meaning':
        return (
          <div className="content-section">
            <h3>Meaning</h3>
            <p>{meaning}</p>
          </div>
        )
      
      case 'questions':
        return (
          <div className="content-section">
            <h3>Reflection Questions</h3>
            <ul>
              {questions?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        )
      
      case 'actions':
        return (
          <div className="content-section">
            <h3>Inspired Actions</h3>
            <ul>
              {actions?.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="card-content">
      <h2 className="card-theme">{theme}</h2>
      
      {renderContent()}
      
      <div className="content-navigation">
        {currentSection !== 'actions' && (
          <button className="nav-button primary" onClick={nextSection}>
            {currentSection === 'meaning' ? 'Reflect' : 'Take Action'}
          </button>
        )}
        
        <div className="section-indicators">
          <span className={`indicator ${currentSection === 'meaning' ? 'active' : ''}`}>•</span>
          <span className={`indicator ${currentSection === 'questions' ? 'active' : ''}`}>•</span>
          <span className={`indicator ${currentSection === 'actions' ? 'active' : ''}`}>•</span>
        </div>
      </div>
    </div>
  )
}

export const CardViewing = () => {
  const { selectedCard, setState, reset } = useAppStore()
  const [currentSection, setCurrentSection] = useState('meaning')
  
  if (!selectedCard) {
    setState('welcome')
    return null
  }
  
  return (
    <div className="viewing-container">
      <div className="card-display">
        {/* 3D scene rendered by UnifiedCanvas */}
      </div>
      
      <div className="card-info">
        <CardContent
          theme={selectedCard.theme}
          meaning={selectedCard.meaning}
          questions={selectedCard.questions}
          actions={selectedCard.actions}
          onNext={setCurrentSection}
        />
        
        <div className="section-indicator">
          Current section: {currentSection}
        </div>
        
        <div className="viewing-actions">
          <button 
            className="action-button secondary"
            onClick={() => setState('selection')}
          >
            Draw Another
          </button>
          
          <button 
            className="action-button secondary"
            onClick={() => {
              reset()
              setState('welcome')
            }}
          >
            Return Home
          </button>
        </div>
      </div>
      
      <style>{`
        .viewing-container {
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          width: 100vw;
          height: 100vh;
          pointer-events: auto;
        }
        
        .card-display {
          flex: 1;
          position: relative;
        }
        
        .card-info {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }
        
        .card-theme {
          font-size: 2rem;
          color: #5a5a5a;
          margin-bottom: 1rem;
          text-transform: capitalize;
          font-weight: 300;
        }
        
        .content-section {
          flex: 1;
          margin: 1rem 0;
        }
        
        .content-section h3 {
          color: #d4af37;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .content-section p {
          color: #6a6a6a;
          line-height: 1.6;
          font-size: 1rem;
        }
        
        .content-section ul {
          list-style: none;
          padding: 0;
        }
        
        .content-section li {
          color: #6a6a6a;
          line-height: 1.6;
          margin-bottom: 0.8rem;
          padding-left: 1.5rem;
          position: relative;
        }
        
        .content-section li::before {
          content: '•';
          color: #d4af37;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .content-navigation {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .nav-button {
          padding: 0.8rem 2rem;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .nav-button.primary {
          background: linear-gradient(135deg, #d4af37, #b8941f);
          color: white;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
        
        .nav-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }
        
        .section-indicators {
          display: flex;
          gap: 0.5rem;
        }
        
        .indicator {
          font-size: 1.5rem;
          color: #ddd;
          transition: color 0.3s ease;
        }
        
        .indicator.active {
          color: #d4af37;
        }
        
        .viewing-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1rem;
        }
        
        .action-button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .action-button.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #5a5a5a;
          border: 2px solid #d4af37;
        }
        
        .action-button.secondary:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .viewing-container {
            flex-direction: column;
          }
          
          .card-display {
            height: 40vh;
          }
          
          .card-info {
            height: 60vh;
            padding: 1rem;
          }
          
          .card-theme {
            font-size: 1.5rem;
          }
          
          .viewing-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .action-button {
            min-width: 150px;
          }
        }
      `}</style>
    </div>
  )
}