// CAPÍTULO 11 — Resultados de eleição. Solução.

const votesFormat = new Intl.NumberFormat('pt-BR');
const pctFormat = new Intl.NumberFormat('pt-BR', {
  style: 'percent', minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const list = document.querySelector('.list');

function span(className, text) {
  const s = document.createElement('span');
  s.className = className;
  s.textContent = text;
  return s;
}

async function load() {
  const response = await fetch('data/results.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();

  document.querySelector('.title').textContent =
    `${data.office} · ${data.city}`;
  document.querySelector('.counted').textContent =
    `${pctFormat.format(data.countedShare)} das urnas apuradas`;

  let total = 0;
  for (const c of data.candidates) total = total + c.votes;

  for (const c of data.candidates) {
    const row = document.createElement('div');
    row.className = 'row';
    row.append(
      span('name', c.name),
      span('pct', pctFormat.format(c.votes / total)),
      span('votes', votesFormat.format(c.votes)),
    );
    list.append(row);
  }
}

async function start() {
  try {
    await load();
  } catch (error) {
    const message = `Não consegui carregar: ${error.message}`;
    list.append(span('error', message));
  }
}

start();
