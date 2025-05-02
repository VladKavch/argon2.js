import argon2 from 'argon2';
import { createInterface } from 'readline';
import { existsSync, chmodSync, readFileSync, writeFileSync } from 'fs';

const HASH_FILE = 'password_hash.txt';
const rl = createInterface({ input: process.stdin, output: process.stdout });

const prompt = (q) => new Promise((res) => rl.question(q, res));

(async () => {
  if (existsSync(HASH_FILE)) {
    chmodSync(HASH_FILE, 0o444);
    const storedHash = readFileSync(HASH_FILE, 'utf8').trim();
    const password = await prompt('Введіть пароль: ');
    const ok = await argon2.verify(storedHash, password);
    console.log(ok ? 'Пароль підтверджено!' : 'Невірний пароль!');
  } else {
    const password = await prompt('Новий пароль: ');
    const confirm = await prompt('Підтвердіть пароль: ');
    if (password !== confirm) {
      console.log('Паролі не співпадають!');
    } else {
      const hash = await argon2.hash(password);
      writeFileSync(HASH_FILE, hash);
      chmodSync(HASH_FILE, 0o444);
      console.log('Пароль збережено!');
    }
  }
  rl.close();
})();
