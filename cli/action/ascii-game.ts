import prompts from 'prompts';

const BANNER = `
╔══════════════════════════════════════╗
║       🎮 アスキーアートゲーム 🎮    ║
╚══════════════════════════════════════╝
`;

const PLAYER = '👾';
const ENEMY = '👻';
const COIN = '💎';
const HEART = '❤️';

function clearScreen() {
  console.clear();
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDodgeGame() {
  console.clear();
  console.log(BANNER);
  console.log('🎯 矢印キーで左右移動！敵を避けろ！\n');

  await prompts({
    type: 'text',
    name: 'ready',
    message: '準備 ok? Enterでスタート...',
  });

  const width = 30;
  const height = 10;
  let playerX = Math.floor(width / 2);
  let score = 0;
  let enemies: { x: number; y: number }[] = [];
  let frame = 0;

  while (true) {
    clearScreen();
    
    console.log('═'.repeat(width + 2));
    
    for (let y = 0; y < height; y++) {
      let line = '│';
      for (let x = 0; x < width; x++) {
        let char = '  ';
        
        if (y === height - 1 && x === playerX) {
          char = PLAYER;
        }
        
        for (const enemy of enemies) {
          if (enemy.y === y && enemy.x === x) {
            char = frame % 20 < 10 ? '👻' : '👺';
          }
        }
        
        line += char;
      }
      line += '│';
      console.log(line);
    }
    
    console.log('═'.repeat(width + 2));
    console.log(`💯 スコア: ${score} | ❤️ HP: 1`);

    if (frame % 3 === 0) {
      enemies.push({ x: Math.floor(Math.random() * width), y: 0 });
    }

    for (const enemy of enemies) {
      enemy.y++;
      if (enemy.y === height - 1 && enemy.x === playerX) {
        console.log('\n💥 当たり！ゲームオーバー...\n');
        console.log(`🏁 最終スコア: ${score}`);
        return;
      }
    }

    enemies = enemies.filter(e => e.y < height);
    score++;

    const input = await prompts({
      type: 'text',
      name: 'move',
      message: '← → で移動 (qで終了)',
    });

    if (input.move === 'q' || input.move === 'Q') {
      console.log('\n🏳️ 終了...\n');
      return;
    }
    
    if (input.move?.includes('←') || input.move?.includes('a')) {
      playerX = Math.max(0, playerX - 1);
    }
    if (input.move?.includes('→') || input.move?.includes('d')) {
      playerX = Math.min(width - 1, playerX + 1);
    }

    frame++;
    await sleep(100);
  }
}

async function runJumpGame() {
  console.clear();
  console.log(BANNER);
  console.log('🏃 Spaceキーでジャンプ！障害物を避けろ！\n');

  await prompts({
    type: 'text',
    name: 'ready',
    message: '準備 ok? Enterでスタート...',
  });

  const width = 30;
  let playerY = 0;
  let velocity = 0;
  let obstacles: { x: number }[] = [];
  let score = 0;
  let frame = 0;
  let jumping = false;

  while (true) {
    clearScreen();
    
    console.log('═'.repeat(width + 2));
    
    for (let y = 5; y >= 0; y--) {
      let line = '│';
      for (let x = 0; x < width; x++) {
        let char = '  ';
        
        if (y === playerY && x === 5) {
          char = jumping ? '🦘' : '🏃';
        }
        
        for (const obs of obstacles) {
          if (y === 0 && obs.x === x) {
            char = '🪨';
          }
        }
        
        line += char;
      }
      line += '│';
      console.log(line);
    }
    
    console.log('═'.repeat(width + 2));
    console.log(`💯 スコア: ${score}`);

    if (!jumping) {
      velocity = 0;
    }
    
    playerY += velocity;
    velocity--;
    
    if (playerY < 0) {
      playerY = 0;
      jumping = false;
    }

    if (frame % 5 === 0) {
      obstacles.push({ x: width - 1 });
    }

    for (const obs of obstacles) {
      obs.x--;
      if (obs.x === 5 && playerY === 0) {
        console.log('\n💥 当たり！ゲームオーバー...\n');
        console.log(`🏁 最終スコア: ${score}`);
        return;
      }
    }

    obstacles = obstacles.filter(o => o.x > 0);
    score++;
    frame++;

    const input = await prompts({
      type: 'text',
      name: 'jump',
      message: 'スペースでジャンプ (qで終了)',
    });

    if (input.jump === 'q' || input.jump === 'Q') {
      console.log('\n🏳️ 終了...\n');
      return;
    }
    
    if ((input.jump === ' ' || input.jump?.includes('スペース')) && !jumping) {
      jumping = true;
      velocity = 3;
    }

    await sleep(150);
  }
}

async function runTypingGame() {
  console.clear();
  console.log(BANNER);
  console.log('⌨️ 単語をタイプしろ！\n');

  await prompts({
    type: 'text',
    name: 'ready',
    message: '準備 ok? Enterでスタート...',
  });

  const words = ['apple', 'banana', 'cherry', 'date', 'elder', 'fig', 'grape'];
  let score = 0;
  let lives = 3;

  while (lives > 0) {
    const targetWord = words[Math.floor(Math.random() * words.length)];
    
    clearScreen();
    console.log('═'.repeat(30));
    console.log(`💯 スコア: ${score} | ❤️ ライフ: ${lives}`);
    console.log('═'.repeat(30));
    console.log(`\n入力: ${targetWord}\n`);
    
    const input = await prompts({
      type: 'text',
      name: 'answer',
      message: 'タイプしてください:',
    });

    if (input.answer === targetWord) {
      console.log('✅ 正解！+10点\n');
      score += 10;
    } else {
      console.log(`❌ 不正解... 正解: ${targetWord}\n`);
      lives--;
    }
    
    await sleep(500);
  }

  console.log('💀 ゲームオーバー...\n');
  console.log(`🏁 最終スコア: ${score}`);
}

async function main() {
  while (true) {
    console.clear();
    console.log(BANNER);
    console.log('アスキーアートで動くゲーム達！\n');

    const choice = await prompts({
      type: 'select',
      name: 'game',
      message: 'ゲーム 선택:',
      choices: [
        { title: '👾 敵避けゲーム', value: 'dodge' },
        { title: '🦘 ジャンプゲーム', value: 'jump' },
        { title: '⌨️ タイピングゲーム', value: 'typing' },
        { title: '❌ 終了', value: 'exit' }
      ]
    });

    if (!choice.game || choice.game === 'exit') {
      console.log('\n👋 ありがとう！またね！');
      break;
    }

    if (choice.game === 'dodge') {
      await runDodgeGame();
    } else if (choice.game === 'jump') {
      await runJumpGame();
    } else if (choice.game === 'typing') {
      await runTypingGame();
    }

    console.log('\n──────────────────────\n');
  }
}

main().catch(console.error);