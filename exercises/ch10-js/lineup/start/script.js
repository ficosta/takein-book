// CAPÍTULO 10 — Escalação. Complete os TODO.

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

// Desenha na lista os jogadores que receber.
function render(selection) {
  list.textContent = '';          // limpa a lista

  for (const player of selection) {
    // TODO 1 — Crie um <li>:
    //   const li = document.createElement('li');

    // TODO 2 — Crie um <span> com a classe "lu-number" e o número
    //          como texto, e ponha dentro do li:
    //   const number = document.createElement('span');
    //   number.className = 'lu-number';
    //   number.textContent = player.number;
    //   li.append(number);

    // TODO 3 — Ponha o nome depois do número:
    //   li.append(player.name);

    // TODO 4 — Se a posição for 'goalkeeper', acrescente a
    //          classe "lu-keeper" ao li (li.classList.add).

    // TODO 5 — Ponha o li na lista:  list.append(li);
  }
}

render(players);

// TODO 6 — Quando clicar em "Só a defesa", desenhe apenas os
//          jogadores de defesa. filter() devolve um array novo
//          só com quem passa no teste:
//   document.querySelector('#defense').addEventListener('click',
//     () => render(players.filter(
//       (p) => p.position === 'defender')));

// TODO 7 — Faça o botão "Todos" voltar a lista completa.
