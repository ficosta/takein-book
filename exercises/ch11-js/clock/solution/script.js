// CAPÍTULO 11 — Relógio. Solução.

const time = document.querySelector('.time');
const date = document.querySelector('.date');

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long',
});

function update() {
  const now = new Date();
  time.textContent = now.toLocaleTimeString('pt-BR');
  date.textContent = dateFormat.format(now);
}

update();
setInterval(update, 1000);
