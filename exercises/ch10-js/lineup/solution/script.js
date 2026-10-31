// CAPÍTULO 10 — Escalação. Solução.

// Os dados: um array de objetos, um por jogador do CD Meridian.
// Numa transmissão, eles viriam de uma API (capítulo 11).
// A posição é um código: goalkeeper (goleiro), defender (defesa),
// midfielder (meio) e forward (ataque).
const players = [
  { number: 1,  name: 'Diego Paredes',   position: 'goalkeeper' },
  { number: 2,  name: 'Lucas Almeida',   position: 'defender' },
  { number: 4,  name: 'Thiago Rocha',    position: 'defender' },
  { number: 3,  name: 'Bruno Castelo',   position: 'defender' },
  { number: 6,  name: 'Caio Ferraz',     position: 'defender' },
  { number: 5,  name: 'Mateus Lira',     position: 'midfielder' },
  { number: 8,  name: 'Gustavo Prado',   position: 'midfielder' },
  { number: 10, name: 'Enzo Batista',    position: 'forward' },
  { number: 11, name: 'Felipe Amaral',   position: 'forward' },
  { number: 7,  name: 'Vitor Sampaio',   position: 'forward' },
  { number: 9,  name: 'Rafael Torres',   position: 'forward' },
];

const list = document.querySelector('.lu-list');

function render(selection) {
  list.textContent = '';

  for (const player of selection) {
    const li = document.createElement('li');

    const number = document.createElement('span');
    number.className = 'lu-number';
    number.textContent = player.number;
    li.append(number);

    li.append(player.name);

    if (player.position === 'goalkeeper') {
      li.classList.add('lu-keeper');
    }

    list.append(li);
  }
}

render(players);

document.querySelector('#defense').addEventListener('click', () => {
  render(players.filter((p) => p.position === 'defender'));
});

document.querySelector('#all').addEventListener('click', () => {
  render(players);
});
