import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

// 3D scene moved to CenteringScene in UnifiedCanvas

export const Centering = () => {
  const { setState, setCenteringProgress, setCenteringPhase } = useAppStore()
  const [phase, setPhase] = useState<'check' | 'breathe' | 'intention' | 'ready'>('check')
  const [breathCount, setBreathCount] = useState(0)
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in')
  const [countdown, setCountdown] = useState(4)

  // Sync phase with store so UnifiedCanvas can access it
  useEffect(() => {
    setCenteringPhase(phase)
  }, [phase, setCenteringPhase])

  const startBreathing = () => {
    setPhase('breathe')
    setCenteringProgress(0.3)
    setBreathCount(0)
    setBreathPhase('in')
    setCountdown(4)
  }

  // Breathing cycle logic
  useEffect(() => {
    if (phase !== 'breathe') return

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) {
          return prev - 1
        } else {
          // Switch between in and out
          if (breathPhase === 'in') {
            setBreathPhase('out')
            return 7 // 7 seconds for exhale
          } else {
            // Complete one full breath cycle
            const newCount = breathCount + 1
            setBreathCount(newCount)

            if (newCount >= 3) {
              // Finished 3 breaths, move to intention
              setPhase('intention')
              setCenteringProgress(0.7)
              setTimeout(() => {
                setPhase('ready')
                setCenteringProgress(1)
              }, 3000)
              return 0
            } else {
              setBreathPhase('in')
              return 4 // 4 seconds for inhale
            }
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, breathPhase, breathCount, setCenteringProgress])
  
  const skipCentering = () => {
    setCenteringProgress(1)
    setState('selection')
  }
  
  useEffect(() => {
    if (phase === 'ready') {
      const timer = setTimeout(() => {
        setState('selection')
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [phase, setState])
  
  return (
    <div className="centering-container">
      
      <div className="centering-actions">
        {phase === 'check' && (
          <div className="check-options">
            <button 
              className="action-button primary"
              onClick={startBreathing}
            >
              I'd like to center myself
            </button>
            
            <button 
              className="action-button secondary"
              onClick={() => setState('selection')}
            >
              I'm already centered
            </button>
          </div>
        )}
        
        {phase === 'breathe' && (
          <div className="breath-guidance">
            <div className="breath-display">
              <div className="breath-instruction-large">
                {breathPhase === 'in' ? 'In' : 'Out'}
              </div>
              <div className="breath-countdown">
                {countdown}
              </div>
            </div>
            <p className="breath-cycle-info">
              Breath {breathCount + 1} of 3
            </p>
            <button
              className="action-button secondary small"
              onClick={skipCentering}
            >
              Skip to cards
            </button>
          </div>
        )}
        
        {phase === 'intention' && (
          <div className="intention-guidance">
            <p className="intention-instruction">
              What guidance are you seeking today?
            </p>
          </div>
        )}
        
        {phase === 'ready' && (
          <div className="ready-message">
            <p className="ready-text">
              Trust your intuition to guide you to the right card
            </p>
          </div>
        )}
      </div>
      
      <style>{`
        .centering-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        }
        
        .centering-actions {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          pointer-events: auto;
        }
        
        .check-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        
        .action-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 220px;
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
        
        .action-button.small {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          min-width: 150px;
        }
        
        .breath-guidance, .intention-guidance, .ready-message {
          text-align: center;
          max-width: 400px;
        }

        .breath-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .breath-instruction-large {
          font-size: 2.5rem;
          color: #d4af37;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .breath-countdown {
          font-size: 4rem;
          color: #5a5a5a;
          font-weight: 300;
          line-height: 1;
        }

        .breath-cycle-info {
          color: #8a8a8a;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .breath-instruction, .intention-instruction, .ready-text {
          color: #6a6a6a;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .centering-actions {
            bottom: 15%;
          }
          
          .action-button {
            min-width: 250px;
            padding: 1.2rem 2rem;
          }
        }
      `}</style>
    </div>
  )
}