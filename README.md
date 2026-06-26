# cli-games

A collection of typing, vocabulary, and ASCII games playable in the terminal.

Built with TypeScript. All games are launcher via a single menu (`game.ts`).

## Games

### 🏃 Race Game (`cli/action/race-game.ts`)
Two racing modes:
- **Enter-mashing dash** — Mash Enter to sprint to the goal before the CPU
- **Typing race** — Type words correctly to advance

### 🎮 ASCII Game (`cli/action/ascii-game.ts`)
Three mini-games rendered with emoji/ASCII characters:
- **Dodge game** — Avoid falling enemies with ←/→ keys
- **Jump game** — Space to jump over obstacles
- **Typing game** — Type the displayed word to score

### 📚 Vocabulary Game (`cli/typing/vocab-game.ts`)
English vocabulary quiz (English → Japanese). Uses spaced repetition — wrong answers are retried in subsequent rounds until all correct.

### 📖 Novel Games (`stories/novel/`)
JSON-driven choose-your-own-adventure stories:
- 💻 ITクイズでデート — IT quiz date
- 🚃 知らない駅で降りる — Getting off at an unknown station
- 🍷 ツンデレソムリエ — Tsundere sommelier
- 🍛 カレーの作り方 — Curry recipe
- ✊✋✌ シンプルじゃんけん — Rock-paper-scissors
- 🔢 ソートクイズ — Sorting quiz

## Getting Started

```bash
npm install
npm run build
npm start
```

Or run individual games directly:

```bash
npm run vocab    # vocabulary game
npm run race     # race game
npm run ascii    # ASCII game
```

## Requirements

- Node.js 18+
- npm
