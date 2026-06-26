import prompts from 'prompts';

const BANNER = `
╔══════════════════════════════════════╗
║       🏃 連打ダッシュ 🏃            ║
╚══════════════════════════════════════╝
`;

const WORDS = [
  'run', 'fast', 'go', 'win', 'race', 'dash', 'speed',
  'goal', 'sport', 'run', 'jump', 'quick', 'swift', 'break'
];

function drawTrack(playerPos: number, cpuPos: number, trackLength: number) {
  let playerLine = '🏃';
  for (let i = 0; i < trackLength; i++) {
    if (i < playerPos) playerLine += '・';
    else if (i === playerPos) playerLine += '+';
    else playerLine += ' ';
  }
  playerLine += '🏁';

  let cpuLine = '🏃';
  for (let i = 0; i < trackLength; i++) {
    if (i < cpuPos) cpuLine += '・';
    else if (i === cpuPos) cpuLine += '+';
    else cpuLine += ' ';
  }
  cpuLine += '🏁';

  console.log('┌' + '─'.repeat(trackLength + 3) + '┐');
  console.log('│ あなた: ' + playerLine + ' │');
  console.log('│ 相手:   ' + cpuLine + ' │');
  console.log('└' + '─'.repeat(trackLength + 3) + '┘');
  console.log(`   あなた: ${playerPos}/${trackLength} | 相手: ${cpuPos}/${trackLength}`);
}

async function runEnterRace() {
  console.clear();
  console.log(BANNER);
  console.log('🏃 100m走のレースだ！');
  console.log('🏁 ゴールまでEnterを連打しろ！\n');

  await prompts({
    type: 'text',
    name: 'ready',
    message: '準備 ok? Enterでスタート...',
  });

  const trackLength = 50;
  let playerPos = 0;
  let cpuPos = 0;
  const cpuGoal = Math.floor(Math.random() * 10) + 40;

  console.clear();
  console.log('🏁 スタート！！\n');

  while (playerPos < trackLength && cpuPos < cpuGoal) {
    drawTrack(playerPos, cpuPos, trackLength);
    console.log('─────────────────────────────');

    const input = await prompts({
      type: 'text',
      name: 'press',
      message: 'Enter連打！ (qで中断)',
    });

    if (input.press && (input.press as string).toLowerCase() === 'q') {
      console.log('\n🏳️ レース中断...\n');
      return;
    }

    if (input.press !== undefined) {
      playerPos++;
      if (Math.random() < 0.35) {
        cpuPos++;
      }
    }
  }

  console.clear();
  console.log('🏁 ゴール！！\n');
  drawTrack(Math.min(playerPos, trackLength), Math.min(cpuPos, trackLength), trackLength);
  console.log('');

  if (playerPos >= trackLength && (cpuPos >= cpuGoal === false || playerPos >= cpuPos)) {
    console.log('🎉 あなたの勝ち！！！');
    console.log('🏅 金Medal 🎉');
  } else {
    console.log('💨 相手の勝ち...');
    console.log('🥈 銀Medal 💨');
  }
}

async function runTypingRace() {
  console.clear();
  console.log(BANNER);
  console.log('⌨️ タイピングレース！');
  console.log('🏁 単語を正確に入力して前に進もう！\n');

  await prompts({
    type: 'text',
    name: 'ready',
    message: '準備 ok? Enterでスタート...',
  });

  const trackLength = 50;
  let playerPos = 0;
  let cpuPos = 0;
  const cpuGoal = Math.floor(Math.random() * 10) + 40;
  let currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];

  console.clear();
  console.log('🏁 スタート！！\n');

  while (playerPos < trackLength && cpuPos < cpuGoal) {
    drawTrack(playerPos, cpuPos, trackLength);
    console.log('');
    console.log('┌' + '─'.repeat(30) + '┐');
    console.log(`│ 単語: ${currentWord}                 │`);
    console.log('└' + '─'.repeat(30) + '┘');
    console.log('─────────────────────────────');

    const input = await prompts({
      type: 'text',
      name: 'answer',
      message: '単語を入力！ (qで中断)',
    });

    if (input.answer && (input.answer as string).toLowerCase() === 'q') {
      console.log('\n🏳️ レース中断...\n');
      return;
    }

    if (input.answer === currentWord) {
      console.log('✅ 正解！ +1前进！\n');
      playerPos++;
      currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    } else {
      console.log('❌ 违章... もう一度！\n');
    }

    if (Math.random() < 0.2) {
      cpuPos++;
    }

    await sleep(300);
  }

  console.clear();
  console.log('🏁 ゴール！！\n');
  drawTrack(Math.min(playerPos, trackLength), Math.min(cpuPos, trackLength), trackLength);
  console.log('');

  if (playerPos >= trackLength && (cpuPos >= cpuGoal === false || playerPos >= cpuPos)) {
    console.log('🎉 あなたの勝ち！！！');
    console.log('🏅 金Medal 🎉');
  } else {
    console.log('💨 相手の勝ち...');
    console.log('🥈 銀Medal 💨');
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  while (true) {
    console.clear();
    console.log(BANNER);
    console.log('レースゲーム选び\n');

    const choice = await prompts({
      type: 'select',
      name: 'game',
      message: 'ゲーム选择:',
      choices: [
        { title: '🏃 連打ダッシュ (Enter連打)', value: 'enter' },
        { title: '⌨️ タイピングレース (単語入力)', value: 'typing' },
        { title: '❌ 終了', value: 'exit' }
      ]
    });

    if (!choice.game || choice.game === 'exit') {
      console.log('\n👋 ありがとう！またね！');
      break;
    }

    if (choice.game === 'enter') {
      await runEnterRace();
    } else if (choice.game === 'typing') {
      await runTypingRace();
    }

    console.log('\n──────────────────────\n');
  }
}

main().catch(console.error);