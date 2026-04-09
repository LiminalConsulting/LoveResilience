import { Card, CardData } from '../types/Card'
import { cardManifest } from './cardManifest'

export type Language = 'en' | 'de'

// Temporary test questions — will be replaced with full list once layout is approved
const testQuestions: Record<string, string> = {
  '65': 'When was the last time you paused to breathe before responding to a challenge?',
}

export const loadCardData = async (language: Language = 'en'): Promise<CardData> => {
  const cards: Card[] = cardManifest.map((num) => {
    const imagePath = `${import.meta.env.BASE_URL}CardSet/${language}/${num}.jpg`
    return {
      id: num,
      name: `card_${num}`,
      theme: num,
      imagePath,
      questions: testQuestions[num] ? [testQuestions[num]] : [],
      actions: [],
    }
  })

  return {
    cards,
    backside: `${import.meta.env.BASE_URL}Backside.jpg`,
    cover: `${import.meta.env.BASE_URL}Cover.png`,
  }
}
