// Tabela do campeonato em páginas de seis times. O número de
// passos depende dos dados: stepCount -1 no manifest.

import { NewsGraphic, gsap } from './base.mjs';

const PER_PAGE = 6;

// Saldo com sinal: 8 → "+8", -4 → "-4".
const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

export default class Table extends NewsGraphic {
  static css = new URL('./table.css', import.meta.url).href;

  html() {
    return `<div class="tbl">
      <div class="tbl-head">
        <div class="tbl-title">
          <span class="tbl-up"><span class="tbl-name"></span></span>
        </div>
        <div class="tbl-info"><span class="tbl-up">
          <span class="tbl-round"></span><span class="tbl-page"></span></span></div>
      </div>
      <div class="tbl-row tbl-labels"><span>#</span><span>Time</span>
        <span>J</span><span>V</span><span>SG</span><span>P</span></div>
      <div class="tbl-body"></div></div>`;
  }

  // Um passo por página.
  stepCount() {
    // TODO — Um passo por página: o número de times dividido por
    //        PER_PAGE, arredondado para cima (Math.ceil), e
    //        nunca menos de 1.
    return 1;
  }

  render(data) {
    this.$('.tbl-name').textContent = data.title ?? '';
    this.$('.tbl-round').textContent = data.round ?? '';
    this.drawPage(Math.max(this.step, 0));
  }

  // Cria as linhas de uma página a partir do array de times.
  drawPage(page) {
    const teams = this.data.teams ?? [];
    const first = page * PER_PAGE;
    const body = this.$('.tbl-body');
    body.textContent = '';
    teams.slice(first, first + PER_PAGE).forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'tbl-row';
      const values = [first + i + 1, t.team, t.played, t.wins,
        signed(t.goalDiff), t.points];
      const classes = ['tbl-pos', 'tbl-team', '', '', '', 'tbl-pts'];
      values.forEach((v, j) => {
        const cell = document.createElement('span');
        cell.className = classes[j];
        cell.textContent = v ?? '';
        row.append(cell);
      });
      body.append(row);
    });
    this.$('.tbl-page').textContent =
      `${page + 1} / ${this.stepCount()}`;
  }

  rows() {
    return this.$('.tbl-body').children;
  }

  entrance(page) {
    this.drawPage(page);
    const $ = (s) => this.$(s);
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set($('.tbl'), { autoAlpha: 1 })
      .fromTo($('.tbl-title'), { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55 }, 0.08)
      .fromTo($('.tbl-name'), { yPercent: 115 },
        { yPercent: 0, duration: 0.6 }, 0.2)
      .fromTo([$('.tbl-info'), $('.tbl-labels')], { autoAlpha: 0, x: -30 },
        { autoAlpha: 1, x: 0, duration: 0.5 }, 0.3)
      .fromTo(this.rows(), { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, stagger: 0.06 },
        0.4);
  }

  // Continue: as linhas saem, a página troca, as novas entram.
  goToStep(page) {
    return gsap.timeline()
      .to(this.rows(), {
        clipPath: 'inset(0% 0% 0% 100%)', duration: 0.25,
        ease: 'power3.in', stagger: 0.03,
      })
      .call(() => this.drawPage(page))
      .add(() => gsap.fromTo(this.rows(),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55,
          ease: 'expo.out', stagger: 0.06 }))
      .to({}, { duration: 0.55 + 0.06 * (PER_PAGE - 1) });
  }

  exit() {
    return gsap.timeline()
      .to(this.$('.tbl'), {
        autoAlpha: 0, y: 30, duration: 0.4, ease: 'power3.in',
      })
      .set(this.$('.tbl'), { y: 0 });
  }
}
