// CAPÍTULO 12 — Registrar e usar o componente. Solução.

import NameCard from './name-card.js';

customElements.define('name-card', NameCard);

const card = document.querySelector('name-card');
card.load({ name: 'Rafael Torres' });

document.querySelector('#show')
  .addEventListener('click', () => card.show());

document.querySelector('#hide')
  .addEventListener('click', () => card.hide());

// load() recria a caixa, que nasce sem "visible". Ela
// aparece de uma vez, sem transição, porque é um elemento
// novo. Trocar dados com o gráfico no ar é outro problema,
// e o OGraf tem um método só para isso (capítulo 16).
document.querySelector('#swap').addEventListener('click', () => {
  card.load({ name: 'Marina Silveira' });
  card.show();
});
