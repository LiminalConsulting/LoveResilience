import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export const Welcome = () => {
  const setState = useAppStore(state => state.setState)

  useEffect(() => {
    if (!localStorage.getItem('loveResilience_userId')) {
      localStorage.setItem('loveResilience_userId', Math.random().toString(36).substring(7))
    }
  }, [])

  return (
    <div className="welcome-container">

      <div className="welcome-header">
        <h1 className="welcome-title">Love Resilience</h1>
        <p className="welcome-tagline">A digital sanctuary for practical spirituality</p>
      </div>

      <div className="welcome-actions">
        <button className="action-button primary" onClick={() => setState('daily')}>
          Card of the Day
        </button>
        <button className="action-button secondary" onClick={() => setState('centering')}>
          Draw a Card
        </button>
      </div>

      <style>{`
        .welcome-container {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100dvh;
          pointer-events: none;
        }

        .welcome-header {
          position: absolute;
          top: clamp(1.5rem, 6vh, 4rem);
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
          white-space: nowrap;
        }

        .welcome-title {
          font-size: clamp(2.7rem, 7.5vw, 4.5rem);
          color: #5a5a5a;
          font-weight: 300;
          letter-spacing: 0.05em;
          margin: 0 0 0.4rem;
        }

        .welcome-tagline {
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          color: #8a8a8a;
          font-weight: 400;
          margin: 0;
        }

        .welcome-actions {
          position: absolute;
          bottom: clamp(8%, 12vh, 20%);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          pointer-events: auto;
          white-space: nowrap;
        }

        .action-button {
          padding: 0.85rem 1.8rem;
          border: none;
          border-radius: 30px;
          font-size: clamp(0.9rem, 2vw, 1rem);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
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
      `}</style>
    </div>
  )
}
