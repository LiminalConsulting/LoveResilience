import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

// 3D scene moved to SelectionScene in UnifiedCanvas

export const CardSelection = () => {
  const { shuffleCards, setState } = useAppStore()

  useEffect(() => {
    shuffleCards()
  }, [shuffleCards])

  return (
    <div className="selection-container">

      <div className="selection-header">
        <h2 className="selection-title">Trust Your Intuition</h2>
        <p className="selection-instruction">Feel into the cards and choose the one that calls to you</p>
      </div>

      <div className="selection-actions">
        <button
          className="action-button secondary"
          onClick={shuffleCards}
        >
          Shuffle Cards
        </button>

        <button
          className="action-button secondary"
          onClick={() => setState('welcome')}
        >
          Back to Welcome
        </button>
      </div>
      
      <style>{`
        .selection-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        }

        .selection-header {
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
          white-space: nowrap;
        }

        .selection-title {
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          color: #5a5a5a;
          font-weight: 300;
          letter-spacing: 0.05em;
          margin: 0 0 0.4rem;
        }

        .selection-instruction {
          font-size: clamp(0.75rem, 1.8vw, 0.95rem);
          color: #7a7a7a;
          font-style: italic;
          margin: 0;
        }

        .selection-actions {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          align-items: center;
          pointer-events: auto;
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
          .selection-actions {
            flex-direction: column;
            bottom: 8%;
          }
          
          .action-button {
            min-width: 150px;
          }
        }
      `}</style>
    </div>
  )
}