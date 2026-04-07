import { Card, CardData } from '../types/Card'
import { cardManifest } from './cardManifest'

// Import all card-content markdown files at build time
const cardContentFiles = import.meta.glob('/card-content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

interface ParsedContent {
  question: string | null
  meaning: string | null
  action: string | null
}

const parseMarkdown = (raw: string): ParsedContent => {
  // Extract sections by heading
  const section = (heading: string): string | null => {
    const regex = new RegExp(`#\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n#\\s|$)`, 'i')
    const match = raw.match(regex)
    return match ? match[1].trim() : null
  }

  const meaning = section('Meaning')
  const question = section('Question')
  const action = section('Action')

  return { meaning, question, action }
}

// Build a lookup from card number to parsed content
const contentByNumber: Record<string, ParsedContent> = {}
for (const [path, raw] of Object.entries(cardContentFiles)) {
  // path like /card-content/01_accept_yourself.md
  const filename = path.split('/').pop() ?? ''
  const num = filename.match(/^(\d+)/)?.[1]
  if (num) {
    contentByNumber[parseInt(num, 10).toString()] = parseMarkdown(raw)
  }
}

const parseFileName = (fileName: string): { id: string; name: string; theme: string; category?: string } => {
  const nameWithoutExt = fileName.replace('.jpg', '')
  const parts = nameWithoutExt.split('_')
  const id = parts[0]
  let theme = parts.slice(1).join(' ')
  let category: string | undefined
  const categoryMatch = theme.match(/^(.*?)\s+([A-Z\s&]+)$/)
  if (categoryMatch) {
    theme = categoryMatch[1].trim()
    category = categoryMatch[2].trim()
  }
  return { id, name: `${id}_${theme.replace(/\s+/g, '_')}`, theme, category }
}

export const loadCardData = async (): Promise<CardData> => {
  const cards: Card[] = []

  for (const fileName of cardManifest) {
    const { id, name, theme, category } = parseFileName(fileName)
    const imagePath = `${import.meta.env.BASE_URL}CardSet/${fileName}`
    const content = contentByNumber[parseInt(id, 10).toString()]

    cards.push({
      id,
      name,
      theme,
      category,
      imagePath,
      meaning: content?.meaning ?? `Reflect on the energy of ${theme}.`,
      questions: content?.question ? [content.question] : [`How does ${theme} show up in your life right now?`],
      actions: content?.action ? [content.action] : [],
    })
  }

  cards.sort((a, b) => parseInt(a.id) - parseInt(b.id))

  return {
    cards,
    backside: `${import.meta.env.BASE_URL}Backside.jpg`,
    cover: `${import.meta.env.BASE_URL}Cover.png`,
  }
}
