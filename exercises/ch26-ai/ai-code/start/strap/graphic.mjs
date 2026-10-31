// Tarja de urgente — gerada por uma IA a partir do pedido:
// "faça um gráfico OGraf de tarja de urgente com GSAP".
// Funciona no navegador. Tem problemas que só aparecem no ar.

import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3/+esm';

class UrgentStrap extends HTMLElement {
  async load({ data }) {
    this.innerHTML = `
      <link rel="stylesheet" href="style.css">
      <div class="strap">
        <div class="strap-kicker"><span>URGENTE</span></div>
        <div class="strap-bar">
          <h1 class="strap-headline">${data.headline}</h1>
        </div>
        <div class="strap-underline"></div>
      </div>`;
    this.strap = this.querySelector('.strap');
    return { statusCode: 200 };
  }

  async playAction() {
    gsap.fromTo(this.strap, { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    return { statusCode: 200 };
  }

  async stopAction() {
    gsap.to(this.strap, { opacity: 0, y: 40, duration: 0.4 });
    return { statusCode: 200 };
  }

  async updateAction({ data }) {
    this.querySelector('.strap-headline').innerHTML = data.headline;
    return { statusCode: 200 };
  }

  async customAction() { return { statusCode: 404 }; }
  async dispose() { this.innerHTML = ''; return { statusCode: 200 }; }
}

customElements.define('urgent-strap', UrgentStrap);
export default UrgentStrap;
