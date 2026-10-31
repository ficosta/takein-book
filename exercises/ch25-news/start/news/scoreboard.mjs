// Placar com relógio de jogo. Gols e relógio vêm de ações
// extras; siglas, cores e período, do formulário.

import { NewsGraphic, gsap } from './base.mjs';

// 125000 ms → "02:05"
function mmss(ms) {
  const s = Math.floor(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default class Scoreboard extends NewsGraphic {
  static css = new URL('./scoreboard.css', import.meta.url).href;

  html() {
    return `<div class="sb"><div class="sb-plates">
      <div class="sb-league"><span class="sb-up sb-league-code"></span></div>
      <div class="sb-team home"><span class="sb-up sb-code home"></span></div>
      <div class="sb-score"><span class="sb-up">
        <span class="sb-goals home">0</span><b>:</b>
        <span class="sb-goals away">0</span></span></div>
      <div class="sb-team away"><span class="sb-up sb-code away"></span></div>
      <div class="sb-clock"><span class="sb-up">
        <span class="sb-period"></span>
        <span class="sb-time stopped">00:00</span></span></div>
    </div></div>`;
  }

  setup() {
    this.goals = { home: 0, away: 0 };
    this.elapsed = 0;        // ms de jogo já contados
    this.startedAt = null;   // quando o relógio começou a correr
    this.ticker = setInterval(() => this.drawClock(), 250);
  }

  onDispose() {
    clearInterval(this.ticker);
  }

  // O tempo de jogo é calculado a partir do horário de início,
  // e não somando segundos: assim ele nunca atrasa.
  gameTime() {
    const running = this.startedAt ? Date.now() - this.startedAt : 0;
    return this.elapsed + running;
  }

  drawClock() {
    const time = this.$('.sb-time');
    time.textContent = mmss(this.gameTime());
    time.classList.toggle('stopped', !this.startedAt);
  }

  render(data) {
    this.$('.sb-league-code').textContent = data.league ?? '';
    this.$('.sb-code.home').textContent = data.home ?? '';
    this.$('.sb-code.away').textContent = data.away ?? '';
    this.$('.sb-period').textContent = data.period ?? '';
    const sb = this.$('.sb');
    if (data.homeColor) sb.style.setProperty('--home-color', data.homeColor);
    if (data.awayColor) sb.style.setProperty('--away-color', data.awayColor);
  }

  // Lê o valor de um token (o GSAP não anima "var(...)").
  token(name) {
    return getComputedStyle(this.root).getPropertyValue(name).trim();
  }

  // Um gol: o número muda, cresce e pisca na cor de destaque.
  score(side) {
    const el = this.$(`.sb-goals.${side}`);
    el.textContent = this.goals[side];
    return gsap.fromTo(el,
      { color: this.token('--accent'), scale: 1.4 },
      { color: this.token('--paper'), scale: 1,
        duration: 0.6, ease: 'expo.out',
        clearProps: 'color' });
  }

  // As ações extras, pelo id declarado no manifest.
  actions = {
    'home-goal'() { this.goals.home += 1; return this.score('home'); },
    'away-goal'() { this.goals.away += 1; return this.score('away'); },
    // TODO — As ações do relógio (seção 25.3):
    //   'start-clock': se this.startedAt estiver vazio, guarde
    //                  Date.now() nele;
    //   'pause-clock': guarde this.gameTime() em this.elapsed e
    //                  esvazie this.startedAt;
    //   'reset-clock': elapsed 0, startedAt vazio.
    //   Nos três, chame this.drawClock() no fim.
  };

  entrance() {
    const plates = this.$('.sb-plates').children;
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set(this.$('.sb'), { autoAlpha: 1 })
      .fromTo(plates, { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, stagger: 0.06 },
        0.08)
      .fromTo(this.root.querySelectorAll('.sb-up'), { yPercent: 160 },
        { yPercent: 0, duration: 0.6, stagger: 0.06 }, 0.2);
  }

  exit() {
    return gsap.timeline()
      .to(this.$('.sb-plates'), {
        clipPath: 'inset(0% 100% 0% 0%)', duration: 0.4, ease: 'power3.in',
      })
      .set(this.$('.sb'), { autoAlpha: 0 })
      .set(this.$('.sb-plates'), { clipPath: 'none' });
  }
}
