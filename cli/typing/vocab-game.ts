import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';

interface VocabItem {
  word: string;
  meaning: string;
  options: string[];
  correctIndex: number;
}

const VOCAB_LIST: VocabItem[] = [
  { word: 'apple', meaning: 'りんご', options: ['りんご', 'バナナ', 'ぶどう', 'オレンジ'], correctIndex: 0 },
  { word: 'banana', meaning: 'バナナ', options: ['りんご', 'バナナ', 'ぶどう', 'オレンジ'], correctIndex: 1 },
  { word: 'grape', meaning: 'ぶどう', options: ['りんご', 'バナナ', 'ぶどう', 'オレンジ'], correctIndex: 2 },
  { word: 'orange', meaning: 'オレンジ', options: ['りんご', 'バナナ', 'ぶどう', 'オレンジ'], correctIndex: 3 },
  { word: 'book', meaning: '本', options: ['本', 'ペン', '机', '椅子'], correctIndex: 0 },
  { word: 'pen', meaning: 'ペン', options: ['本', 'ペン', '机', '椅子'], correctIndex: 1 },
  { word: 'desk', meaning: '机', options: ['本', 'ペン', '机', '椅子'], correctIndex: 2 },
  { word: 'chair', meaning: '椅子', options: ['本', 'ペン', '机', '椅子'], correctIndex: 3 },
  { word: 'cat', meaning: '猫', options: ['犬', '猫', '鳥', '魚'], correctIndex: 1 },
  { word: 'dog', meaning: '犬', options: ['犬', '猫', '鳥', '魚'], correctIndex: 0 }
];

const BANNER = `
╔══════════════════════════════════════╗
║       📚 英単語帳 📚                 ║
╚══════════════════════════════════════╝
`;

async function runVocabGame() {
  let wrongItems: VocabItem[] = [...VOCAB_LIST];
  let round = 1;

  console.log('不正解だった単語だけが出題されます。\n');

  while (wrongItems.length > 0) {
    console.log(`【Round ${round}】残り: ${wrongItems.length}問\n`);

    const currentWrong: VocabItem[] = [];
    
    for (const item of wrongItems) {
      console.log(`Q: ${item.word} の意味は？`);
      
      const choices = item.options.map((opt, i) => ({
        title: opt,
        value: i
      }));

      const answer = await prompts({
        type: 'select',
        name: 'answer',
        message: '',
        choices
      });

      if (answer.answer === item.correctIndex) {
        console.log('✅ 正解！\n');
      } else {
        console.log(`❌ 不正解... 正解: ${item.meaning}\n`);
        currentWrong.push(item);
      }
    }

    wrongItems = currentWrong;
    round++;

    if (wrongItems.length > 0) {
      console.log(`🔄 不正解: ${wrongItems.length}問 → もう一度出題します\n`);
      
      await prompts({
        type: 'text',
        name: 'continue',
        message: 'Enterで次Roundへ...',
      });
    }
  }

  console.log('\n🎉 全問正解！お疲れ様でした！');
}

async function main() {
  while (true) {
    console.log(BANNER);
    console.log('英単語を覚えて、不正解だった単語だけ復習しましょう。\n');

    const start = await prompts({
      type: 'select',
      name: 'start',
      message: '選択:',
      choices: [
        { title: '🎮 始める', value: 'start' },
        { title: '❌ 終了', value: 'exit' }
      ]
    });

    if (!start.start || start.start === 'exit') {
      console.log('\n👋 ありがとう！またね！');
      break;
    }

    await runVocabGame();

    console.log('\n──────────────────────\n');
  }
}

main().catch(console.error);