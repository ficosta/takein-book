// CAPÍTULO 11 — Relógio. Complete os TODO.

const time = document.querySelector('.time');
const date = document.querySelector('.date');

// Um formatador de data em português, criado uma vez só.
const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long',
});

function update() {
  const now = new Date();   // o instante de agora

  // TODO 1 — Escreva a hora no elemento .time:
  //   time.textContent = now.toLocaleTimeString('pt-BR');

  // TODO 2 — Escreva a data no elemento .date:
  //   date.textContent = dateFormat.format(now);
}

update();

// TODO 3 — Chame update() a cada 1000 milissegundos:
//   setInterval(update, 1000);
