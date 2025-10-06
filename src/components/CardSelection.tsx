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
      {/* Instructions are in 3D scene - SelectionScene.tsx */}

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