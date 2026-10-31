// Os testes do caderno. Não precisa mexer aqui: cada linha chama
// uma função com um valor e compara com o que deveria sair.

const results = [];

function check(name, got, expected) {
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  results.push({ name, ok, got, expected });
}

function attempt(name, fn, expected) {
  try { check(name, fn(), expected); }
  catch (error) { check(name, `erro: ${error.message}`, expected); }
}

const standings = [
  { team: 'Atlético Oro', points: 55, goalDiff: 14 },
  { team: 'CD Meridian', points: 58, goalDiff: 21 },
  { team: 'Nova Castela', points: 55, goalDiff: 20 },
];

attempt('1 double(21)', () => double(21), 42);
attempt('2 greeting', () => greeting('Ana'), 'Boa noite, Ana!');
attempt('3 isEven(7)', () => isEven(7), false);
attempt('3 isEven(10)', () => isEven(10), true);
attempt('4 larger(3, 9)', () => larger(3, 9), 9);
attempt('5 scoreText', () => scoreText('MER', 2, 1, 'ATL'), 'MER 2 × 1 ATL');
attempt('6 winner', () => winner('MER', 0, 1, 'ATL'), 'ATL');
attempt('6 empate', () => winner('MER', 1, 1, 'ATL'), 'empate');
attempt('7 sum', () => sum([3, 5, 12]), 20);
attempt('8 average', () => average([7, 8, 10]), 8.3);
attempt('9 above', () => above([10, 25, 31, 18], 20), [25, 31]);
attempt('10 initials', () => initials('Ana  Souza'), 'AS');
attempt('11 cleanRole', () => cleanRole('  repórter   especial '), 'REPÓRTER ESPECIAL');
attempt('12 truncate', () => truncate('Dólar fecha em queda', 12), 'Dólar fecha…');
attempt('12 curto', () => truncate('Curto', 12), 'Curto');
attempt('13 reais', () => reais(5.4), 'R$ 5,40');
attempt('14 mmss', () => mmss(125000), '02:05');
attempt('15 rank', () => rank(standings).map((t) => t.team), ['CD Meridian', 'Nova Castela', 'Atlético Oro']);
attempt('15 sem mexer', () => standings[0].team, 'Atlético Oro');
attempt('16 temperature', () => temperature(28.7), '29°');
attempt('17 describeWeather(0)', () => describeWeather(0), 'Céu limpo');
attempt('17 describeWeather(81)', () => describeWeather(81), 'Chuva');
attempt('17 describeWeather(95)', () => describeWeather(95), 'Tempestade');

// Mostra na página e no Console.
const right = results.filter((r) => r.ok).length;
document.querySelector('.nb-score').textContent = `${right} / ${results.length}`;
for (const r of results) {
  const item = document.createElement('div');
  item.className = `nb-item ${r.ok ? 'ok' : 'fail'}`;
  const text = r.ok
    ? `✔ ${r.name}`
    : `✘ ${r.name}: deu ${JSON.stringify(r.got)}, esperado ${JSON.stringify(r.expected)}`;
  const span = document.createElement('span');
  span.textContent = text;
  span.title = text;            // o texto inteiro, ao passar o mouse
  item.append(span);
  document.querySelector('.nb-list').append(item);
  console.log(text);
}
