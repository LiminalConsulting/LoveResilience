import { Card, CardData } from '../types/Card'
import { cardManifest } from './cardManifest'

export type Language = 'en' | 'de'

export const loadCardData = async (language: Language = 'en'): Promise<CardData> => {
  const cards: Card[] = cardManifest.map((num) => {
    const imagePath = `${import.meta.env.BASE_URL}CardSet/${language}/${num}.jpg`
    return {
      id: num,
      name: `card_${num}`,
      theme: num,
      imagePath,
      questions: [],
      actions: [],
    }
  })

  return {
    cards,
    backside: `${import.meta.env.BASE_URL}Backside.jpg`,
    cover: `${import.meta.env.BASE_URL}Cover.png`,
  }
}
