// CAPÍTULO 12 — Uma classe que vira uma tag nova. Solução.

export default class NameCard extends HTMLElement {

  load(data) {
    this.innerHTML = '<div class="box"></div>';
    this.box = this.querySelector('.box');
    this.box.textContent = data.name;
  }

  show() {
    this.box.classList.add('visible');
  }

  hide() {
    this.box.classList.remove('visible');
  }
}
