// CADERNO DE JAVASCRIPT — solução.
// Cada função é um exercício. O arquivo tests.js confere todas
// e mostra o resultado na página e no Console.

// ── Parte 1: valores e decisões ─────────────────────────────

// 1. O dobro de um número.
function double(n) {
  return n * 2;
}

// 2. "Boa noite, Ana!"
function greeting(name) {
  return `Boa noite, ${name}!`;
}

// 3. true se o número for par. Dica: o resto da divisão, %.
function isEven(n) {
  return n % 2 === 0;
}

// 4. O maior de dois números, sem usar Math.max.
function larger(a, b) {
  if (a > b) return a;
  return b;
}

// 5. "MER 2 × 1 ATL"
function scoreText(home, homeGoals, awayGoals, away) {
  return `${home} ${homeGoals} × ${awayGoals} ${away}`;
}

// 6. A sigla de quem venceu, ou "empate".
function winner(home, homeGoals, awayGoals, away) {
  if (homeGoals > awayGoals) return home;
  if (awayGoals > homeGoals) return away;
  return 'empate';
}

// ── Parte 2: listas ─────────────────────────────────────────

// 7. A soma de uma lista de números.
function sum(numbers) {
  let total = 0;
  for (const n of numbers) total = total + n;
  return total;
}

// 8. A média, arredondada para uma casa decimal.
function average(numbers) {
  if (numbers.length === 0) return 0;
  return Math.round((sum(numbers) / numbers.length) * 10) / 10;
}

// 9. Só os números acima do limite.
function above(numbers, limit) {
  return numbers.filter((n) => n > limit);
}

// 10. As iniciais: "Ana Souza" → "AS".
function initials(name) {
  return name.split(' ')
    .filter((part) => part !== '')
    .map((part) => part[0].toUpperCase())
    .join('');
}

// ── Parte 3: texto para a tela ──────────────────────────────

// 11. Função limpa: sem espaços sobrando, em maiúsculas.
//     "  repórter   especial " → "REPÓRTER ESPECIAL"
function cleanRole(text) {
  return text.trim().split(/\s+/).join(' ').toUpperCase();
}

// 12. Corta o texto em "max" caracteres, terminando em "…".
function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

// 13. Valor em reais: 5.4 → "R$ 5,40".
function reais(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(value).replace(/\s/, ' ');
}

// 14. Milissegundos em "mm:ss": 125000 → "02:05".
function mmss(ms) {
  const s = Math.floor(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// ── Parte 4: dados de verdade ───────────────────────────────

// 15. Classificação: mais pontos primeiro; empate, maior saldo.
//     Não mude a lista original: ordene uma cópia.
function rank(teams) {
  return [...teams].sort((a, b) =>
    b.points - a.points || b.goalDiff - a.goalDiff);
}

// 16. Temperatura para a tela: 28.7 → "29°".
function temperature(celsius) {
  return `${Math.round(celsius)}°`;
}

// 17. O código de tempo da Open-Meteo (padrão WMO) em palavras.
//     0 → "Céu limpo"; 1, 2 → "Poucas nuvens"; 3 → "Nublado";
//     45, 48 → "Nevoeiro"; 51 a 57 → "Garoa";
//     61 a 67 e 80 a 82 → "Chuva"; 71 a 77 e 85, 86 → "Neve";
//     95 a 99 → "Tempestade". Outro código → "—".
function describeWeather(code) {
  if (code === 0) return 'Céu limpo';
  if (code <= 2) return 'Poucas nuvens';
  if (code === 3) return 'Nublado';
  if (code === 45 || code === 48) return 'Nevoeiro';
  if (code >= 51 && code <= 57) return 'Garoa';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return 'Chuva';
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return 'Neve';
  }
  if (code >= 95 && code <= 99) return 'Tempestade';
  return '—';
}
