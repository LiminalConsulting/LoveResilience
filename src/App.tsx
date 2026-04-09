import { useEffect, Suspense } from 'react'
import { useAppStore } from './store/useAppStore'
import { loadCardData } from './data/cardLoader'
import { UnifiedCanvas } from './components/UnifiedCanvas'
import { Welcome } from './components/Welcome'
import { Centering } from './components/Centering'
import { CardSelection } from './components/CardSelection'
import { DailyCard } from './components/DailyCard'

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="loading-orb"></div>
      <p>Loading your cards...</p>
    </div>

    <style>{`
      .loading-screen {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
      }

      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }

      .loading-orb {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d4af37, #b8941f);
        opacity: 0.6;
        animation: pulse 2s ease-in-out infinite;
      }

      .loading-content p {
        color: #8a8a8a;
        font-size: 1.1rem;
        font-weight: 400;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
    `}</style>
  </div>
)

const LanguageToggle = () => {
  const language = useAppStore(state => state.language)
  const setLanguage = useAppStore(state => state.setLanguage)

  return (
    <div className="lang-toggle">
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => language !== 'en' && setLanguage('en')}
      >
        EN
      </button>
      <span className="lang-sep">|</span>
      <button
        className={`lang-btn ${language === 'de' ? 'active' : ''}`}
        onClick={() => language !== 'de' && setLanguage('de')}
      >
        DE
      </button>

      <style>{`
        .lang-toggle {
          position: fixed;
          top: 1rem;
          right: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          z-index: 100;
          pointer-events: auto;
        }
        .lang-btn {
          background: none;
          border: none;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #b0a898;
          cursor: pointer;
          padding: 0.2rem 0.1rem;
          transition: color 0.2s;
        }
        .lang-btn.active {
          color: #d4af37;
        }
        .lang-btn:hover:not(.active) {
          color: #8a8a8a;
        }
        .lang-sep {
          font-size: 0.7rem;
          color: #c8c0b4;
          user-select: none;
        }
      `}</style>
    </div>
  )
}

function App() {
  const { currentState, setCardData, cardData, language } = useAppStore()

  // Load card data once on mount using the persisted language preference
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = await loadCardData(language)
        setCardData(data)
      } catch (error) {
        console.error('Failed to load card data:', error)
      }
    }

    initializeApp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCardData]) // language changes are handled by store.setLanguage patching paths in-place

  if (!cardData) {
    return <LoadingScreen />
  }

  return (
    <div className="app">
      {/* Unified Canvas - persistent across all states */}
      <UnifiedCanvas />

      {/* UI Overlays - rendered on top of canvas */}
      <Suspense fallback={<LoadingScreen />}>
        {currentState === 'welcome' && <Welcome />}
        {currentState === 'centering' && <Centering />}
        {currentState === 'selection' && <CardSelection />}
        {currentState === 'daily' && <DailyCard />}
      </Suspense>

      {/* Language toggle - always visible */}
      <LanguageToggle />

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-smooth: antialiased;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          margin: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
        }

        #root {
          width: 100vw;
          height: 100dvh;
        }

        .app {
          width: 100%;
          height: 100%;
        }

        button {
          font-family: inherit;
        }

        canvas {
          outline: none;
          touch-action: none;
        }
      `}</style>
    </div>
  )
}

export default App
