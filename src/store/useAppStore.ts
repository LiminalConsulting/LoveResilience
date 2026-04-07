import { create } from 'zustand'
import { Card, CardData, AppState } from '../types/Card'
import type { Language } from '../data/cardLoader'

interface AppStore {
  // State
  language: Language
  currentState: AppState
  previousState: AppState | null
  isTransitioning: boolean
  transitionProgress: number
  cardData: CardData | null
  selectedCard: Card | null
  focusedCardId: string | null
  shuffledCards: Card[]
  dailyCard: Card | null
  centeringProgress: number
  centeringPhase: 'check' | 'breathe' | 'intention' | 'ready'
  breathPhase: 'in' | 'out'
  breathCountdown: number

  // Actions
  setLanguage: (lang: Language) => void
  setState: (state: AppState) => void
  startTransition: (toState: AppState) => void
  setTransitionProgress: (progress: number) => void
  completeTransition: () => void
  setCardData: (data: CardData) => void
  setSelectedCard: (card: Card | null) => void
  setFocusedCardId: (id: string | null) => void
  shuffleCards: () => void
  selectRandomCard: () => Card | null
  getDailyCard: () => Card | null
  setCenteringProgress: (progress: number) => void
  setCenteringPhase: (phase: 'check' | 'breathe' | 'intention' | 'ready') => void
  setBreathPhase: (phase: 'in' | 'out') => void
  setBreathCountdown: (countdown: number) => void
  triggerShuffle: (() => void) | null
  reset: () => void
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const getDailyCardId = (): string => {
  const today = new Date().toDateString()
  const userId = localStorage.getItem('loveResilience_userId') || 'default'
  const seed = today + userId
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return Math.abs(hash).toString()
}

export const useAppStore = create<AppStore>((set, get) => ({
  language: (localStorage.getItem('loveResilience_lang') as Language) ?? 'en',
  currentState: 'welcome',
  previousState: null,
  isTransitioning: false,
  transitionProgress: 0,
  cardData: null,
  selectedCard: null,
  focusedCardId: null,
  shuffledCards: [],
  dailyCard: null,
  centeringProgress: 0,
  centeringPhase: 'check',
  breathPhase: 'in',
  breathCountdown: 4,
  triggerShuffle: null,

  setLanguage: (lang) => {
    localStorage.setItem('loveResilience_lang', lang)
    const { cardData, selectedCard, dailyCard } = get()

    // Patch image paths in-place — preserve all scene state (focused card, mode, etc.)
    const patchPath = (path: string) =>
      path.replace(/\/CardSet\/(en|de)\//, `/CardSet/${lang}/`)

    const patchCard = (card: Card): Card => ({ ...card, imagePath: patchPath(card.imagePath) })

    const newCardData = cardData ? {
      ...cardData,
      cards: cardData.cards.map(patchCard),
    } : null

    set({
      language: lang,
      cardData: newCardData,
      selectedCard: selectedCard ? patchCard(selectedCard) : null,
      dailyCard: dailyCard ? patchCard(dailyCard) : null,
    })
  },

  setState: (state) => set({ currentState: state }),

  startTransition: (toState) => {
    const { currentState } = get()
    set({
      previousState: currentState,
      currentState: toState,
      isTransitioning: true,
      transitionProgress: 0
    })
  },

  setTransitionProgress: (progress) => set({ transitionProgress: progress }),

  completeTransition: () => {
    set({
      previousState: null,
      isTransitioning: false,
      transitionProgress: 1
    })
  },
  
  setCardData: (data) => {
    set({ cardData: data })
    get().shuffleCards()
  },
  
  setSelectedCard: (card) => set({ selectedCard: card }),

  setFocusedCardId: (id) => set({ focusedCardId: id }),
  
  shuffleCards: () => {
    const { cardData } = get()
    if (cardData) {
      const shuffled = shuffleArray(cardData.cards)
      set({ shuffledCards: shuffled })
    }
  },
  
  selectRandomCard: () => {
    const { cardData } = get()
    if (!cardData || cardData.cards.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * cardData.cards.length)
    const card = cardData.cards[randomIndex]
    set({ selectedCard: card })
    return card
  },
  
  getDailyCard: () => {
    const { cardData, dailyCard } = get()
    if (!cardData || cardData.cards.length === 0) return null

    if (dailyCard) {
      // Always sync selectedCard in case it was cleared by reset()
      set({ selectedCard: dailyCard })
      return dailyCard
    }

    const dailyCardId = getDailyCardId()
    const cardIndex = parseInt(dailyCardId) % cardData.cards.length
    const card = cardData.cards[cardIndex]

    set({ dailyCard: card, selectedCard: card })
    return card
  },
  
  setCenteringProgress: (progress) => set({ centeringProgress: progress }),

  setCenteringPhase: (phase) => set({ centeringPhase: phase }),

  setBreathPhase: (phase) => set({ breathPhase: phase }),

  setBreathCountdown: (countdown) => set({ breathCountdown: countdown }),

  reset: () => set({
    currentState: 'welcome',
    selectedCard: null,
    focusedCardId: null,
    centeringProgress: 0,
    centeringPhase: 'check'
  })
}))