import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

// 3D scene moved to DailyCardScene in UnifiedCanvas

export const DailyCard = () => {
  const { getDailyCard, selectedCard, setState } = useAppStore()
  
  useEffect(() => {
    getDailyCard()
  }, [getDailyCard])
  
  if (!selectedCard) {
    return (
      <div className="daily-loading">
        <p>Preparing your daily card...</p>
      </div>
    )
  }
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="daily-container">
      {/* Left side - empty space for 3D card from DailyCardScene */}
      <div className="card-spacer"></div>

      {/* Right side - content panel */}
      <div className="content-panel">
        <div className="daily-header">
          <h1 className="daily-title">Your Card for Today</h1>
          <p className="daily-date">{currentDate}</p>
          <h2 className="card-theme">{selectedCard.theme}</h2>
        </div>

        <div className="daily-messages">
          <div className="daily-message">
            <h3>Today's Message</h3>
            <p>{selectedCard.meaning || 'Let the energy of this card guide your day.'}</p>
          </div>

          <div className="daily-intention">
            <h3>Intention for Today</h3>
            <p>How might you embody the energy of <strong>{selectedCard.theme}</strong> in your day?</p>
          </div>
        </div>

        <div className="daily-actions">
          <button
            className="action-button primary"
            onClick={() => setState('viewing')}
          >
            Explore Deeper
          </button>

          <button
            className="action-button secondary"
            onClick={() => setState('centering')}
          >
            Draw Another Card
          </button>

          <button
            className="action-button secondary"
            onClick={() => setState('welcome')}
          >
            Return Home
          </button>
        </div>
      </div>
      
      <style>{`
        .daily-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          pointer-events: none;
        }

        .card-spacer {
          flex: 1;
          pointer-events: none;
        }

        .daily-loading {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
        }

        .daily-loading p {
          color: #8a8a8a;
          font-size: 1.1rem;
        }

        .content-panel {
          flex: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          overflow-y: auto;
          pointer-events: auto;
        }

        .daily-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .daily-title {
          font-size: 2rem;
          color: #5a5a5a;
          font-weight: 300;
          margin-bottom: 0.5rem;
        }

        .daily-date {
          color: #8a8a8a;
          font-size: 1rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
        }

        .card-theme {
          font-size: 2.5rem;
          color: #5a5a5a;
          font-weight: 300;
          text-transform: capitalize;
          margin-top: 1rem;
        }

        .daily-messages {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .daily-message, .daily-intention {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          backdrop-filter: blur(5px);
        }

        .daily-message h3, .daily-intention h3 {
          color: #d4af37;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .daily-message p, .daily-intention p {
          color: #6a6a6a;
          line-height: 1.8;
          font-size: 1.15rem;
        }
        
        .daily-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .action-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
        }
        
        .action-button.primary {
          background: linear-gradient(135deg, #d4af37, #b8941f);
          color: white;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
        
        .action-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
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
          .daily-container {
            padding: 1rem;
          }
          
          .daily-title {
            font-size: 2rem;
          }
          
          .daily-date {
            font-size: 1rem;
          }
          
          .daily-card-display {
            height: 300px;
          }
          
          .daily-content {
            max-width: 90%;
          }
          
          .daily-message, .daily-intention {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          
          .daily-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .action-button {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  )
}