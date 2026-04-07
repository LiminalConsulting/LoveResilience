import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

// 3D scene (orb only) is in CenteringScene in UnifiedCanvas

export const Centering = () => {
  const { setState, setCenteringProgress, setCenteringPhase, setBreathPhase, setBreathCountdown } = useAppStore()
  const [phase, setPhase] = useState<'check' | 'breathe' | 'intention' | 'ready'>('check')
  const [breathCount, setBreathCount] = useState(0)
  const [breathPhase, setBreathPhaseLocal] = useState<'in' | 'out'>('in')
  const [countdown, setCountdown] = useState(4)
  const [fadingOut, setFadingOut] = useState(false)

  // Sync phase with store so UnifiedCanvas can access it
  useEffect(() => {
    const timer = setTimeout(() => {
      setCenteringPhase(phase)
    }, 0)
    return () => clearTimeout(timer)
  }, [phase, setCenteringPhase])

  // Sync breath phase and countdown with store
  useEffect(() => {
    const timer = setTimeout(() => {
      setBreathPhase(breathPhase)
      setBreathCountdown(countdown)
    }, 0)
    return () => clearTimeout(timer)
  }, [breathPhase, countdown, setBreathPhase, setBreathCountdown])

  const startBreathing = () => {
    setFadingOut(true)
    setTimeout(() => {
      setFadingOut(false)
      setPhase('breathe')
      setCenteringProgress(0.3)
      setBreathCount(0)
      setBreathPhaseLocal('in')
      setCountdown(4)
    }, 1000)
  }

  // Breathing cycle logic
  useEffect(() => {
    if (phase !== 'breathe') return

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) {
          return prev - 1
        } else {
          if (breathPhase === 'in') {
            setBreathPhaseLocal('out')
            return 7
          } else {
            const newCount = breathCount + 1
            setBreathCount(newCount)

            if (newCount >= 3) {
              setPhase('intention')
              setCenteringProgress(0.7)
              return 0
            } else {
              setBreathPhaseLocal('in')
              return 4
            }
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, breathPhase, breathCount, setCenteringProgress])

  // Handle intention -> ready transition
  useEffect(() => {
    if (phase === 'intention') {
      const timer = setTimeout(() => {
        setPhase('ready')
        setCenteringProgress(1)
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [phase, setCenteringProgress])

  const skipCentering = () => {
    setCenteringProgress(1)
    setState('selection')
  }

  useEffect(() => {
    if (phase === 'ready') {
      const timer = setTimeout(() => {
        setState('selection')
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [phase, setState])

  const phaseText: Record<string, string> = {
    check: 'How are you feeling right now?',
    breathe: 'Follow the gentle rhythm with your breath',
    intention: 'Set your intention for this moment',
    ready: 'You are centered and ready',
  }

  // For intention/ready we want fade-in then fade-out within the phase duration
  const phaseTextClass = (p: string) => {
    if (p === 'intention') return 'centering-phase-text fade-in-out-long'
    if (p === 'ready') return 'centering-phase-text fade-in-out'
    if (fadingOut) return 'centering-phase-text fade-out'
    return 'centering-phase-text fade-in'
  }

  return (
    <div className="centering-container fade-in">

      {/* Phase text — centered in upper portion of screen */}
      <div key={phase} className={phaseTextClass(phase)}>
        {phaseText[phase]}
      </div>

      <div className="centering-actions">
        {phase === 'check' && (
          <div className={`check-options${fadingOut ? ' fade-out' : ''}`}>
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
          <div className="breath-guidance fade-in">
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
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes fadeInOut {
          0%   { opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes fadeInOutLong {
          0%   { opacity: 0; }
          11%  { opacity: 1; }
          89%  { opacity: 1; }
          100% { opacity: 0; }
        }

        .centering-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        }

        .centering-container.fade-in {
          animation: fadeIn 1.2s ease-in forwards;
        }

        .centering-phase-text {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: #5a5a5a;
          font-weight: 300;
          width: 80%;
          max-width: 500px;
          pointer-events: none;
        }

        .centering-phase-text.fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .centering-phase-text.fade-out {
          animation: fadeOut 0.8s ease-in forwards;
        }

        .centering-phase-text.fade-in-out {
          animation: fadeInOut 4s ease forwards;
        }

        .centering-phase-text.fade-in-out-long {
          animation: fadeInOutLong 7s ease forwards;
        }

        .check-options.fade-out {
          animation: fadeOut 0.8s ease-out forwards;
          pointer-events: none;
        }

        .breath-guidance.fade-in {
          animation: fadeIn 1s ease-in forwards;
        }

        .centering-actions {
          position: absolute;
          bottom: 8%;
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
          flex-direction: row;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .action-button {
          padding: 0.85rem 1.8rem;
          border: none;
          border-radius: 30px;
          font-size: clamp(0.85rem, 2vw, 1rem);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
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

        .breath-guidance {
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
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          color: #d4af37;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .breath-countdown {
          font-size: clamp(2.5rem, 8vw, 4rem);
          color: #5a5a5a;
          font-weight: 300;
          line-height: 1;
        }

        .breath-cycle-info {
          color: #8a8a8a;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 480px) {
          .centering-actions {
            bottom: 12%;
          }
        }
      `}</style>
    </div>
  )
}
