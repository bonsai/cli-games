import * as fs from 'fs';
import * as path from 'path';
import { spawn, execSync } from 'child_process';
import prompts from 'prompts';

const BANNER = `
╔══════════════════════════════════════╗
║       🎮 ゲーム選択画面 🎮            ║
╚══════════════════════════════════════╝
`;

interface GameInfo {
  id: string;
  title: string;
  type: 'novel' | 'action' | 'typing' | 'shooting' | 'puzzle' | 'draw' | 'special';
  runCommand?: string;
  isWeb?: boolean;
  webPath?: string;
}

const GAMES: GameInfo[] = [
  // 選択ノベルゲーム (stories/novel/)
  { id: 'it-quiz-date', title: '💻 ITクイズでデート', type: 'novel' },
  { id: 'unknown-station', title: '🚃 知らない駅で降りる', type: 'novel' },
  { id: 'wine-quiz', title: '🍷 ツンデレソムリエ', type: 'novel' },
  { id: 'curry-recipe', title: '🍛 カレーの作り方', type: 'novel' },
  
  // アクションゲーム (stories/ + games/action/)
  { id: 'rock-paper-scissors', title: '✊✋✌ シンプルじゃんけん', type: 'action' },
  { id: 'sorting-quiz', title: '🔢 ソートクイズ', type: 'action' },
  { id: 'race-game', title: '🏃 連打ダッシュ', type: 'action', runCommand: 'npm run race' },
  { id: 'ascii-game', title: '🎮 アスキーゲーム', type: 'action', runCommand: 'npm run ascii' },
  
  // タイピングゲーム (games/typing/)
  { id: 'vocab-game', title: '📚 英単語帳', type: 'typing', runCommand: 'npm run vocab' },
  
  // Webゲームはファイル名から自動検出 (genre-filename.html)
  
  // シューティング (games/shooting/) - 未実装
  // パズル (games/puzzle/) - 未実装
];

const TYPE_LABELS: Record<string, string> = {
  'novel': '📖 選択ノベル',
  'action': '🎯 アクション',
  'typing': '⌨️ タイピング',
  'shooting': '🔫 シューティング',
  'puzzle': '🧩 パズル'
};

async function runGame(storyFile: string) {
  const storiesDir = path.join(process.cwd(), 'stories', 'novel');
  const storyPath = path.join(storiesDir, storyFile);
  const story = JSON.parse(fs.readFileSync(storyPath, 'utf-8'));
  let currentId: string = story.start;

  async function showPassage(): Promise<string> {
    const passage = story.passages[currentId];
    if (!passage) { console.log('エラー: パッセージが見つかりません'); return 'end'; }

    const separator = '─'.repeat(40);
    console.log(`\n${separator}\n${passage.text}\n${separator}`);

    if (passage.choices?.length) {
      const choiceResponse = await prompts({
        type: 'select',
        name: 'next',
        message: '👉 選択:',
        choices: passage.choices.map((c: any) => ({ title: c.text, value: c.next }))
      });

      if (choiceResponse.next) {
        if (choiceResponse.next === 'exit') {
          return 'exit';
        }
        currentId = choiceResponse.next;
        return await showPassage();
      } else {
        return 'end';
      }
    } else {
      return 'end';
    }
  }

  console.log(`\n🎮 ${story.title}\n`);
  const result = await showPassage();
  return result;
}

function getGameChoices() {
  const novelDir = path.join(process.cwd(), 'stories', 'novel');
  let storyFiles: string[] = [];
  try {
    storyFiles = fs.readdirSync(novelDir).filter(file => file.endsWith('.json'));
  } catch {
    storyFiles = [];
  }

  const choices: any[] = [];

  const novelGames = GAMES.filter(g => g.type === 'novel').filter(g => {
    const storyFile = `${g.id}.json`;
    return storyFiles.includes(storyFile);
  });
  
  const actionGames = GAMES.filter(g => g.type === 'action').filter(g => {
    const storyFile = `${g.id}.json`;
    return storyFiles.includes(storyFile);
  });
  
  const typingGames = GAMES.filter(g => g.type === 'typing' || g.id === 'race-game');
  const specialGames = GAMES.filter(g => g.id === 'ascii-game');

  // 選択ノベル
  if (novelGames.length > 0) {
    choices.push({ title: '📖 選択ノベルゲーム', value: 'header', disabled: true });
    for (const game of novelGames) {
      choices.push({ title: `  ${game.title}`, value: game.id });
    }
  }

  // アクション
  if (actionGames.length > 0) {
    choices.push({ title: '🎯 アクションゲーム', value: 'header', disabled: true });
    for (const game of actionGames) {
      if (game.id === 'rock-paper-scissors' && storyFiles.includes('rock-paper-scissors.json')) {
        choices.push({ title: `  ${game.title}`, value: game.id });
      } else if (game.id === 'sorting-quiz' && storyFiles.includes('sorting-quiz.json')) {
        choices.push({ title: `  ${game.title}`, value: game.id });
      }
    }
  }

  // タイピング
  choices.push({ title: '⌨️ タイピングゲーム', value: 'header', disabled: true });
  for (const game of typingGames) {
    choices.push({ title: `  ${game.title}`, value: game.id });
  }

  // 特殊ゲーム
  choices.push({ title: '🎮 特殊ゲーム', value: 'header', disabled: true });
  for (const game of specialGames) {
    choices.push({ title: `  ${game.title}`, value: game.id });
  }

  // Webゲーム（ファイル名から自動検出）
  const webDir = path.join(process.cwd(), 'web');
  const webGames: { id: string; title: string; type: string; path: string }[] = [];
  
  // フォルダからHTMLファイルをスキャン
  const genreMap: Record<string, string> = {
    'action': '🎯 アクション',
    'shooting': '🔫 シューティング',
    'novel': '📖 ノベル',
    'typing': '⌨️ タイピング',
    'puzzle': '🧩 パズル',
    'draw': '🎨 お絵かき'
  };

  try {
    const files = fs.readdirSync(webDir);
    for (const file of files) {
      if (file.endsWith('.html')) {
        const genre = file.split('-')[0];
        if (genreMap[genre]) {
          const title = file.replace('.html', '').replace(/^[a-z]+-/, '');
          webGames.push({
            id: `web-${file.replace('.html', '')}`,
            title: `${genreMap[genre]} - ${title}`,
            type: genre,
            path: file
          });
        }
      }
    }
  } catch {}

  if (webGames.length > 0) {
    choices.push({ title: '🌐 Webゲーム', value: 'header', disabled: true });
    for (const game of webGames) {
      choices.push({ title: `  ${game.title}`, value: game.id });
    }
  }

  // リスタート
  choices.push({ title: '', value: 'header', disabled: true });
  choices.push({ title: '🔄 リスタート', value: 'restart' });

  return choices;
}

async function main() {
  while (true) {
    console.clear();
    console.log(BANNER);

    const choices = getGameChoices();

    console.log('🎯 遊べるゲーム:\n');

    const gameResponse = await prompts({
      type: 'select',
      name: 'gameId',
      message: '',
      choices
    });

    if (!gameResponse.gameId) {
      console.log('\n👋 ありがとう！またね！');
      break;
    }

    if (gameResponse.gameId === 'restart') {
      console.log('\n🔄 リスタートします...\n');
      try {
        execSync('npm start', { cwd: process.cwd(), stdio: 'inherit', shell: true, windowsHide: true } as any);
      } catch {}
      break;
    }

    // 自動検出されたWebゲーム
    if (gameResponse.gameId.startsWith('web-')) {
      const filename = gameResponse.gameId.replace('web-', '') + '.html';
      const webPath = path.join(process.cwd(), 'web', filename);
      console.log('\n🌐 Webゲームをブラウザで開きます...\n');
      try {
        execSync(`start "" "${webPath}"`, { shell: true, windowsHide: true } as any);
      } catch {}
      console.log('\n🔙 ゲーム選択に戻ります...\n');
      continue;
    }

    const game = GAMES.find(g => g.id === gameResponse.gameId);
    if (!game) continue;

    if (game.isWeb && game.webPath) {
      console.log('\n🌐 Webゲームをブラウザで開きます...\n');
      const webPath = path.join(process.cwd(), game.webPath);
      try {
        execSync(`start "" "${webPath}"`, { shell: true, windowsHide: true } as any);
      } catch {}
      console.log('\n🔙 ゲーム選択に戻ります...\n');
      continue;
    }

    if (game.runCommand) {
      console.log('\n🎮 ゲームを起動...\n');
      try {
        execSync(game.runCommand, { cwd: process.cwd(), stdio: 'inherit', shell: true, windowsHide: true } as any);
      } catch {}
      console.log('\n🔙 ゲーム選択に戻ります...\n');
      continue;
    }

    const storyFile = `${game.id}.json`;
    const result = await runGame(storyFile);
    
    if (result === 'exit') {
      console.log('\n🔙 トップに戻ります...\n');
      continue;
    }

    console.log('\n👋 プレイしてくれてありがとう！\n');
  }
}

main().catch(console.error);