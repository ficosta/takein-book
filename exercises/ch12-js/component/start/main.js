// CAPÍTULO 12 — Registrar e usar o componente.

import NameCard from './name-card.js';

// TODO 2 — Registre a tag, ligando o nome à classe:
//   customElements.define('name-card', NameCard);

const card = document.querySelector('name-card');
card.load({ name: 'Rafael Torres' });

document.querySelector('#show')
  .addEventListener('click', () => card.show());

// TODO 3 — Ligue o botão "Esconder" ao método hide().

// TODO 4 — O botão "Trocar nome" chama load() com outro
//          nome e depois show(). O que acontece com a
//          transição? Por quê?
