import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

const t = {
  en: {
    label: 'Your Card for Today',
    drawCard: 'Draw a Card',
    returnHome: 'Return Home',
    locale: 'en-US',
  },
  de: {
    label: 'Deine Karte für heute',
    drawCard: 'Karte ziehen',
    returnHome: 'Zur Startseite',
    locale: 'de-DE',
  },
}

export const DailyCard = () => {
  const { getDailyCard, selectedCard, setState, reset, language } = useAppStore()
  const tx = t[language]

  useEffect(() => {
    getDailyCard()
  }, [getDailyCard])

  if (!selectedCard) return null

  const currentDate = new Date().toLocaleDateString(tx.locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const question = selectedCard.questions?.[0] ?? null

  return (
    <div className="daily-container">

      <div className="daily-header">
        <p className="daily-label">{tx.label}</p>
        <p className="daily-date">{currentDate}</p>
      </div>

      {question && (
        <div className="daily-question">
          <p className="question-text">{question}</p>
        </div>
      )}

      <div className="daily-actions">
        <button className="action-button secondary" onClick={() => setState('selection')}>
          {tx.drawCard}
        </button>
        <button className="action-button secondary" onClick={() => { reset(); setState('welcome') }}>
          {tx.returnHome}
        </button>
      </div>

      <style>{`
        .daily-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          pointer-events: none;
        }

        .daily-header {
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
          white-space: nowrap;
        }

        .daily-label {
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          color: #5a5a5a;
          font-weight: 300;
          letter-spacing: 0.05em;
          margin: 0 0 0.3rem;
        }

        .daily-date {
          font-size: clamp(0.75rem, 1.8vw, 0.95rem);
          color: #8a8a8a;
          font-weight: 400;
          margin: 0;
        }

        .daily-question {
          position: absolute;
          bottom: 18%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          max-width: min(600px, 85vw);
          pointer-events: none;
          animation: fadeUp 0.8s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .question-text {
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: #5a5a5a;
          font-weight: 300;
          font-style: italic;
          line-height: 1.6;
          margin: 0;
        }

        .daily-actions {
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
          font-size: clamp(0.96rem, 2.4vw, 1.08rem);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
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
