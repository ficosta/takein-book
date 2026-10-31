// Previsão do tempo com dados reais da Open-Meteo, uma API
// gratuita que não pede chave. Busca ao carregar e de tempos em
// tempos; se a rede falhar, fica o último dado bom (capítulo 19).

import { NewsGraphic, gsap } from './base.mjs';

// Latitude e longitude de cada cidade do select.
const CITIES = {
  'sao-paulo': { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  'rio': { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17 },
  'brasilia': { name: 'Brasília', lat: -15.79, lon: -47.88 },
  'porto-alegre': { name: 'Porto Alegre', lat: -30.03, lon: -51.23 },
  'recife': { name: 'Recife', lat: -8.05, lon: -34.88 },
  'manaus': { name: 'Manaus', lat: -3.12, lon: -60.02 },
};

// O código de tempo (padrão WMO) em palavras e ícone.
function describe(code) {
  if (code === 0) return ['Céu limpo', 'sun'];
  if (code <= 2) return ['Poucas nuvens', 'sun-cloud'];
  if (code === 3) return ['Nublado', 'cloud'];
  if (code === 45 || code === 48) return ['Nevoeiro', 'mist'];
  if (code >= 51 && code <= 57) return ['Garoa', 'rain'];
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return ['Chuva', 'rain'];
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return ['Neve', 'snow'];
  }
  if (code >= 95 && code <= 99) return ['Tempestade', 'storm'];
  return ['—', 'cloud'];
}

// Ícones em SVG, desenhados com currentColor (capítulo 8). A
// nuvem e a névoa têm classe: o CSS pinta com var(--paper).
const CLOUD = 'M20 48h28a11 11 0 0 0 0-22 15 15 0 0 0-29-3A12 12 0 0 0 20 48z';
const ICONS = {
  'sun': `<circle cx="32" cy="32" r="12" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="4" stroke-linecap="round">
    <path d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6"/></g>`,
  'sun-cloud': `<circle cx="24" cy="22" r="10" fill="currentColor"/>
    <path class="cloud" d="${CLOUD}" transform="translate(6 6) scale(0.85)"/>`,
  'cloud': `<path class="cloud" d="${CLOUD}"/>`,
  'rain': `<path class="cloud" d="${CLOUD}" transform="translate(0 -6)"/>
    <path d="M22 50l-3 8M32 50l-3 8M42 50l-3 8" stroke="currentColor"
      stroke-width="4" stroke-linecap="round"/>`,
  'storm': `<path class="cloud" d="${CLOUD}" transform="translate(0 -8)"/>
    <path d="M34 40l-8 12h7l-4 10 12-15h-7l4-7z" fill="currentColor"/>`,
  'snow': `<path class="cloud" d="${CLOUD}" transform="translate(0 -6)"/>
    <g fill="currentColor"><circle cx="22" cy="54" r="3"/>
    <circle cx="32" cy="58" r="3"/><circle cx="42" cy="54" r="3"/></g>`,
  'mist': `<path class="mist" d="M12 24h40M8 34h48M14 44h36"
    stroke-width="5" stroke-linecap="round"/>`,
};

const WEEKDAY = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short', timeZone: 'UTC',
});

// Monta o endereço da API para uma cidade.
export function buildUrl(city) {
  // TODO 1 — Monte o endereço com URLSearchParams (seção 28.7):
  //   latitude, longitude, current, daily, timezone e
  //   forecast_days, e devolva
  //   `https://api.open-meteo.com/v1/forecast?${params}`
  return '';
}

export default class Forecast extends NewsGraphic {
  static css = new URL('./forecast.css', import.meta.url).href;

  html() {
    const day = `<div class="wx-day"><div class="wx-name">—</div>
      <div class="wx-body"><div class="wx-icon"></div><div>
        <div class="wx-temps">—</div><div class="wx-desc">—</div>
      </div></div></div>`;
    return `<div class="wx">
      <div class="wx-kicker">
        <span class="wx-up">Previsão do tempo</span>
      </div>
      <div class="wx-bar"><span class="wx-up wx-city"></span>
        <span class="wx-up wx-now"></span></div>
      <div class="wx-days">${day}${day}${day}</div>
      <div class="wx-source">Fonte: Open-Meteo.com</div></div>`;
  }

  // O load da base, e depois a primeira busca: o gráfico só diz
  // "carreguei" quando já tem a previsão (ou desistiu dela).
  async load(args) {
    const response = await super.load(args);
    await this.fetchForecast();
    return response;
  }

  setup() {
    this.timer = null;
  }

  onDispose() {
    clearInterval(this.timer);
  }

  render(data) {
    const city = CITIES[data.city] ?? CITIES['sao-paulo'];
    this.$('.wx-city').textContent = city.name;
    // Cidade nova, ou intervalo novo: busca de novo e reprograma.
    if (data.city !== this.currentCity
      || data.interval !== this.currentInterval) {
      this.currentCity = data.city;
      this.currentInterval = data.interval;
      clearInterval(this.timer);
      const minutes = Math.max(data.interval ?? 10, 1);
      this.timer = setInterval(() => this.fetchForecast(), minutes * 60000);
      if (this.fetched) this.fetchForecast();
    }
  }

  async fetchForecast() {
    this.fetched = true;
    const city = CITIES[this.data.city] ?? CITIES['sao-paulo'];
    // TODO 2 — Busque buildUrl(city) com fetch, com
    //   cache: 'no-store' e signal: AbortSignal.timeout(5000).
    //   Se der certo, this.draw(dados). Se der errado, só um
    //   console.warn: o último dado bom fica na tela.
  }

  draw(api) {
    const now = Math.round(api.current.temperature_2m);
    this.$('.wx-now').textContent = `Agora ${now}°`;
    const days = this.root.querySelectorAll('.wx-day');
    api.daily.time.forEach((date, i) => {
      const [text, icon] = describe(api.daily.weather_code[i]);
      const max = Math.round(api.daily.temperature_2m_max[i]);
      const min = Math.round(api.daily.temperature_2m_min[i]);
      const name = i === 0 ? 'Hoje'
        : WEEKDAY.format(new Date(`${date}T12:00:00Z`)).replace('.', '');
      const el = days[i];
      el.querySelector('.wx-name').textContent = name;
      el.querySelector('.wx-desc').textContent = text;
      el.querySelector('.wx-icon').innerHTML =
        `<svg viewBox="0 0 64 64">${ICONS[icon]}</svg>`;
      el.querySelector('.wx-temps').innerHTML =
        `${max}°<span class="wx-min">${min}°</span>`;
    });
  }

  entrance() {
    const $ = (s) => this.$(s);
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set($('.wx'), { autoAlpha: 1 })
      .fromTo($('.wx-bar'), { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55 }, 0.08)
      .fromTo([$('.wx-city'), $('.wx-now')], { yPercent: 115 },
        { yPercent: 0, duration: 0.6, stagger: 0.1 }, 0.2)
      .fromTo($('.wx-kicker'), { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45 }, 0.32)
      .fromTo(this.root.querySelectorAll('.wx-day'), { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.4)
      .fromTo($('.wx-source'), { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4 }, 0.7);
  }

  exit() {
    return gsap.timeline()
      .to(this.$('.wx'), {
        autoAlpha: 0, y: 30, duration: 0.4, ease: 'power3.in',
      })
      .set(this.$('.wx'), { y: 0 });
  }
}
