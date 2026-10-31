// CAPÍTULO 9 — solução.

// ── 1. Variáveis ─────────────────────────────────────────
const name = 'Rafael';
let goals = 0;
console.log(name, goals);

// ── 2. Contas ────────────────────────────────────────────
goals = goals + 1;
console.log(goals);

// ── 3. Textos com valores dentro ─────────────────────────
console.log(`${name} marcou ${goals} gol`);

// ── 4. Decisão ───────────────────────────────────────────
let word;
if (goals === 1) {
  word = 'gol';
} else {
  word = 'gols';
}
console.log(`${name} marcou ${goals} ${word}`);

// ── 5. Funções ───────────────────────────────────────────
function timeOnAir(text) {
  const words = text.split(' ').length;
  const seconds = Math.ceil(words / 3);
  return Math.max(seconds, 4);
}

console.log(timeOnAir('Rafael Torres'));
console.log(timeOnAir('Rafael Torres, atacante do CD Meridian'));
console.log(timeOnAir('Ministro da Economia anuncia hoje em ' +
  'Brasília novas regras para o setor elétrico a partir de janeiro'));
