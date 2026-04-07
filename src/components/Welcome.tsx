import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

// 3D elements moved to UnifiedCanvas/scenes
// This component now only handles UI overlay

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
        <button 
          className="action-button primary"
          onClick={() => setState('daily')}
        >
          Card of the Day
        </button>
        
        <button 
          className="action-button secondary"
          onClick={() => setState('centering')}
        >
          Draw a Card
        </button>
        
        <p className="welcome-subtitle">
          Take a moment to center yourself and connect with your inner wisdom
        </p>
      </div>
      
      <style>{`
        .welcome-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }

        .welcome-header {
          position: absolute;
          top: 28%;
          text-align: center;
          pointer-events: none;
        }

        .welcome-title {
          font-size: clamp(1.8rem, 5vw, 3rem);
          color: #5a5a5a;
          font-weight: 300;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem;
        }

        .welcome-tagline {
          font-size: clamp(0.8rem, 2vw, 1rem);
          color: #8a8a8a;
          font-weight: 400;
          margin: 0;
        }

        .welcome-actions {
          position: absolute;
          bottom: 20%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          pointer-events: auto;
        }
        
        .action-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
          text-align: center;
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
        
        .welcome-subtitle {
          margin-top: 1.5rem;
          color: #8a8a8a;
          text-align: center;
          font-size: 0.9rem;
          max-width: 300px;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .welcome-actions {
            bottom: 15%;
          }
          
          .action-button {
            min-width: 250px;
            padding: 1.2rem 2rem;
          }
          
          .welcome-subtitle {
            max-width: 250px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}