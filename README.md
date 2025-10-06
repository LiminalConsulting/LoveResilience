# Love Resilience - Digital Card Deck

A beautiful digital sanctuary for practical spirituality, featuring an interactive 3D card deck for daily inspiration and guidance.

## ✨ Features

- **Digital Temple Experience**: Guided centering flow before card selection
- **Card of the Day**: Personalized daily cards with consistent results per user
- **Intuitive Selection**: 3D card interface with hover effects and intuitive picking
- **Beautiful Design**: Soft, elegant aesthetic with 70 hand-crafted card designs
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Professional Spirituality**: Appeals to both business professionals and spiritual seekers

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5173/LoveResilience/`

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# E2E tests in debug mode
npm run test:e2e:debug
```

## 🎯 How to Use

1. **Welcome Screen**: Choose between "Card of the Day" or "Draw a Card"
2. **Centering**: Brief moment to center yourself and set intention
3. **Selection**: Intuitively choose a card from the shuffled deck
4. **Guidance**: Explore meaning, reflection questions, and inspired actions

## 🛠 Tech Stack

- **React + TypeScript** for robust component architecture
- **React Three Fiber** for beautiful 3D card interactions
- **Vite** for fast development and optimized builds
- **Zustand** for elegant state management
- **Vitest** for comprehensive testing
- **Playwright** for E2E testing and visual regression
- **Git LFS** for efficient media asset management

## 🎨 Card Collection

70 beautiful cards covering themes of:
- **Self-Love & Acceptance** 
- **Resilience & Strength**
- **Purpose & Vision**
- **Connection & Support**
- **Healing & Growth**
- **Joy & Gratitude**

## 📝 Current Status

### ✅ Completed
- Full React Three Fiber app implementation
- Unified canvas architecture with smooth scene transitions
- Core 3D card rendering with flat appearance and rounded corners (alpha mask)
- Basic UI features:
  - Tab interface for card content (Meaning/Questions/Actions)
  - Quote hover with sparkle animation
  - Card selection instruction text in 3D
  - Breathing exercise with countdown
  - Split-screen layout (3D left, content panel right)
- Comprehensive test suite (Vitest + Playwright)
- **AI-driven development workflow** with Playwright MCP server
- TypeScript integration
- Responsive design
- Local development environment

### 🚧 In Progress / Known Issues

**From transcript.txt (source of truth for requirements):**

1. **Card Corner Rounding** - ✅ DONE (using alpha mask)
2. **Tab Interface for Card Viewing** - ✅ DONE (Meaning/Questions/Actions tabs)
3. **Quote Display** - ✅ DONE (hover on sparkle below card)
4. **Card Selection Text** - ✅ DONE ("Trust your intuition", "Take a deep breath", "In and out", "Feel into the cards...")
5. **Card of the Day Layout** - ✅ DONE (card left, content panel right with golden orb)
6. **Breathing Exercise** - ✅ DONE (countdown timer, 4s in / 7s out, 3 cycles)

**Still TODO (from transcript):**

7. **Tilt-toward-cursor NOT working universally** - Currently broken/not functional across all card instances
8. **Shuffle Animation** - Cards should fly to center, stack, then fly out to new positions
9. **Card Selection Transition** - When clicking card, smooth animation to viewing mode (others fade/fly out)
10. **Wing Element from "Let the Light In" card** - Add to Welcome screen as decorative element
11. **Card Content from PDF** - Parse PDF and create individual text files per card (meaning, questions, actions)
12. **Editable Document Generation** - Create document with card images + text for Tanja's reference
13. **Text overlapping with cards in selection screen** - Layout needs adjustment

**Technical Debt:**
- GitHub Pages Deployment: Git LFS media files causing deployment failures
  - Issue: `gh-pages` package fails with E2BIG error due to 278MB of card images
  - Solution needed: Investigate GitHub Actions deployment or alternative hosting

## 🤖 AI-Driven Development

This project includes **Playwright MCP server** integration for autonomous AI-assisted development:

### Setup
The Playwright MCP server is included as a git submodule in `mcp-servers/playwright/`.

**To enable in Claude Code:**
1. Project has `.mcp-config.json` pre-configured
2. Run `/mcp` to verify server connection
3. AI can now autonomously run tests and iterate on features

### Autonomous Development Flow
1. **AI writes code** for new features
2. **AI runs E2E tests** via MCP server
3. **AI sees visual feedback** (screenshots, videos)
4. **AI iterates** based on test results
5. **Repeat** until feature is complete

This creates a **feedback loop** where the AI can develop features independently with real validation.

---

*Built with practical spirituality in mind - bridging the technical and the transcendent* ✨