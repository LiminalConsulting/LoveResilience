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
      <div className="daily-header">
        <h1 className="daily-title">Your Card for Today</h1>
        <p className="daily-date">{currentDate}</p>
      </div>
      
      <div className="daily-card-display">
        {/* 3D scene rendered by UnifiedCanvas */}
      </div>
      
      <div className="daily-content">
        <div className="daily-message">
          <h3>Today's Message</h3>
          <p>{selectedCard.meaning}</p>
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
      
      <style>{`
        .daily-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          overflow-y: auto;
          pointer-events: auto;
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
        
        .daily-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .daily-title {
          font-size: 2.5rem;
          color: #5a5a5a;
          font-weight: 300;
          margin-bottom: 0.5rem;
        }
        
        .daily-date {
          color: #8a8a8a;
          font-size: 1.1rem;
          font-weight: 400;
        }
        
        .daily-card-display {
          width: 100%;
          max-width: 500px;
          height: 400px;
          margin: 1rem 0;
        }
        
        .daily-content {
          max-width: 600px;
          margin: 1rem 0;
          text-align: center;
        }
        
        .daily-message, .daily-intention {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        
        .daily-message h3, .daily-intention h3 {
          color: #d4af37;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .daily-message p, .daily-intention p {
          color: #6a6a6a;
          line-height: 1.6;
          font-size: 1rem;
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