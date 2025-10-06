import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

// 3D scene moved to ViewingScene in UnifiedCanvas

const CardContent = ({
  theme,
  meaning,
  questions,
  actions,
  quotes
}: {
  theme: string
  meaning?: string
  questions?: string[]
  actions?: string[]
  quotes?: string[]
}) => {
  const [currentSection, setCurrentSection] = useState<'meaning' | 'questions' | 'actions' | null>(null)

  const renderContent = () => {
    if (!currentSection) {
      return (
        <div className="tab-prompt">
          <p>Click on a section above to explore</p>
        </div>
      )
    }

    switch (currentSection) {
      case 'meaning':
        return (
          <div className="content-section">
            <p>{meaning || 'Meaning content will be added soon.'}</p>
          </div>
        )

      case 'questions':
        return (
          <div className="content-section">
            <ul>
              {questions?.map((question, index) => (
                <li key={index}>{question}</li>
              )) || <li>Reflection questions will be added soon.</li>}
            </ul>
          </div>
        )

      case 'actions':
        return (
          <div className="content-section">
            <ul>
              {actions?.map((action, index) => (
                <li key={index}>{action}</li>
              )) || <li>Inspired actions will be added soon.</li>}
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

      {/* Tab Headers */}
      <div className="tab-headers">
        <button
          className={`tab-header ${currentSection === 'meaning' ? 'active' : ''}`}
          onClick={() => setCurrentSection(currentSection === 'meaning' ? null : 'meaning')}
        >
          Meaning
        </button>
        <button
          className={`tab-header ${currentSection === 'questions' ? 'active' : ''}`}
          onClick={() => setCurrentSection(currentSection === 'questions' ? null : 'questions')}
        >
          Questions
        </button>
        <button
          className={`tab-header ${currentSection === 'actions' ? 'active' : ''}`}
          onClick={() => setCurrentSection(currentSection === 'actions' ? null : 'actions')}
        >
          Actions
        </button>
      </div>

      {/* Content Area */}
      {renderContent()}
    </div>
  )
}

export const CardViewing = () => {
  const { selectedCard, setState, reset } = useAppStore()
  const [showQuote, setShowQuote] = useState(false)

  if (!selectedCard) {
    setState('welcome')
    return null
  }

  // Placeholder quote - will be replaced with actual card quotes
  const quote = "Let the light illuminate your path forward."

  return (
    <div className="viewing-container">
      {/* Left side - for 3D card from ViewingScene + quote */}
      <div className="left-section">
        {/* Quote hover element - positioned below card area */}
        <div className="quote-container">
          <div
            className="quote-trigger"
            onMouseEnter={() => setShowQuote(true)}
            onMouseLeave={() => setShowQuote(false)}
          >
            ✨
          </div>
          {showQuote && (
            <div className="quote-bubble">
              <p>"{quote}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Right side - text content panel */}
      <div className="info-panel">
        <CardContent
          theme={selectedCard.theme}
          meaning={selectedCard.meaning}
          questions={selectedCard.questions}
          actions={selectedCard.actions}
          quotes={[quote]}
        />

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
          pointer-events: none;
        }

        .left-section {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 10%;
          pointer-events: none;
        }

        .quote-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          pointer-events: auto;
        }

        .quote-trigger {
          font-size: 2rem;
          cursor: pointer;
          animation: sparkle 2s ease-in-out infinite;
          transition: transform 0.3s ease;
        }

        .quote-trigger:hover {
          transform: scale(1.2);
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .quote-bubble {
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem 2rem;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
          border: 2px solid #d4af37;
          max-width: 300px;
          animation: fadeIn 0.3s ease;
        }

        .quote-bubble p {
          color: #5a5a5a;
          font-size: 1rem;
          font-style: italic;
          line-height: 1.5;
          margin: 0;
          text-align: center;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .info-panel {
          flex: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          pointer-events: auto;
        }

        .card-theme {
          font-size: 2.5rem;
          color: #5a5a5a;
          margin-bottom: 2rem;
          text-transform: capitalize;
          font-weight: 300;
          text-align: center;
        }

        .tab-headers {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
          border-bottom: 2px solid rgba(212, 175, 55, 0.2);
          padding-bottom: 0.5rem;
        }

        .tab-header {
          background: none;
          border: none;
          padding: 0.8rem 1.5rem;
          font-size: 1.1rem;
          font-weight: 500;
          color: #8a8a8a;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          position: relative;
          bottom: -0.5rem;
        }

        .tab-header:hover {
          color: #d4af37;
        }

        .tab-header.active {
          color: #d4af37;
          border-bottom-color: #d4af37;
        }

        .tab-prompt {
          text-align: center;
          padding: 3rem 2rem;
          color: #8a8a8a;
          font-size: 1.1rem;
          font-style: italic;
        }

        .content-section {
          flex: 1;
          margin: 1rem 0;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        .content-section p {
          color: #6a6a6a;
          line-height: 1.8;
          font-size: 1.15rem;
        }

        .content-section ul {
          list-style: none;
          padding: 0;
        }

        .content-section li {
          color: #6a6a6a;
          line-height: 1.8;
          margin-bottom: 1rem;
          padding-left: 1.8rem;
          position: relative;
          font-size: 1.1rem;
        }

        .content-section li::before {
          content: '•';
          color: #d4af37;
          font-weight: bold;
          position: absolute;
          left: 0;
          font-size: 1.3rem;
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