// CAPÍTULO 12 — Uma classe que vira uma tag nova.
// "extends HTMLElement": o NameCard é um tipo de elemento HTML.

export default class NameCard extends HTMLElement {

  // Monta a "cena" e aplica os dados.
  load(data) {
    this.innerHTML = '<div class="box"></div>';
    this.box = this.querySelector('.box');
    this.box.textContent = data.name;
  }

  show() {
    this.box.classList.add('visible');
  }

  // TODO 1 — Escreva o método hide(), que tira a classe
  //          "visible" da caixa.
}
