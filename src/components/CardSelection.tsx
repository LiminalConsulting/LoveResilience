import { useAppStore } from '../store/useAppStore'

const t = {
  en: {
    title: 'Trust Your Intuition',
    instruction: 'Feel into the cards and choose the one that calls to you',
    shuffle: 'Shuffle Cards',
    drawAnother: 'Draw Another',
    returnHome: 'Return Home',
    backToWelcome: 'Back to Welcome',
  },
  de: {
    title: 'Vertraue deiner Intuition',
    instruction: 'Spüre in die Karten hinein und wähle die, die dich anspricht',
    shuffle: 'Karten mischen',
    drawAnother: 'Noch eine Karte',
    returnHome: 'Zur Startseite',
    backToWelcome: 'Zurück',
  },
}

export const CardSelection = () => {
  const {
    setState,
    selectedCard,
    focusedCardId,
    setSelectedCard,
    setFocusedCardId,
    triggerShuffle,
    reset,
    language,
  } = useAppStore()
  const tx = t[language]

  const isFocused = !!focusedCardId
  const question = selectedCard?.questions?.[0] ?? null

  const handleDrawAnother = () => {
    setSelectedCard(null)
    setFocusedCardId(null)
  }

  const handleReturnHome = () => {
    setFocusedCardId(null)
    reset()
    setState('welcome')
  }

  return (
    <div className="selection-container">

      {!isFocused && (
        <div className="selection-header">
          <h2 className="selection-title">{tx.title}</h2>
          <p className="selection-instruction">{tx.instruction}</p>
        </div>
      )}

      {isFocused && question && (
        <div key={focusedCardId} className="card-question">
          <p className="question-text">{question}</p>
        </div>
      )}

      <div className="selection-actions">
        {!isFocused && (
          <button className="action-button secondary" onClick={() => triggerShuffle?.()}>
            {tx.shuffle}
          </button>
        )}

        {isFocused && (
          <button className="action-button secondary" onClick={handleDrawAnother}>
            {tx.drawAnother}
          </button>
        )}

        <button
          className="action-button secondary"
          onClick={isFocused ? handleReturnHome : () => setState('welcome')}
        >
          {isFocused ? tx.returnHome : tx.backToWelcome}
        </button>
      </div>

      <style>{`
        .selection-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
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

        .card-question {
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
