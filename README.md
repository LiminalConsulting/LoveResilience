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
- All core features working
- Comprehensive test suite (Vitest + Playwright)
- **AI-driven development workflow** with Playwright MCP server
- TypeScript integration
- Responsive design
- Local development environment

### 🔧 Known Issues
- **GitHub Pages Deployment**: Git LFS media files causing deployment failures
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