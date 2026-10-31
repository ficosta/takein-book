# Lower third — as etapas (guia para os capítulos)

A lower third esportiva da referência (`_shared/reference/sample.html`, pele liga):
kicker = função (ATACANTE), placa = nome (RAFAEL TORRES), sub-barra = time · CAMISA 9,
número vazado (fantasma) atrás e sublinhado. Dados: Rafael Torres · Atacante · CD Meridian · 9.

Regra: `start/` da etapa N+1 = `solution/` da etapa N + os TODO novos.
Desde o ch05 cada pasta traz `tokens.css` + `fonts/` (Anton, Barlow Condensed, OFL-*.txt);
os `Inter-Variable.woff2`/`LICENSE.txt` antigos ficaram nas pastas `fonts/`, sem uso.

## A árvore (igual do ch04 ao ch17)

```
.lt                 container (ancora, 820 × 190)
├─ .lt-ghost        o número vazado (texto: 9)
├─ .lt-kicker       faixa de destaque
│  └─ span.lt-role      Atacante
├─ .lt-bar          placa do nome (lâmina = .lt-bar::before)
│  └─ div.lt-name       Rafael Torres
├─ .lt-sub          sub-barra
│  ├─ span.lt-team      CD Meridian
│  ├─ span.lt-dot       (vazio: o ponto)
│  └─ span.lt-shirt     Camisa 9   (no JS: `CAMISA ${number}`)
└─ .lt-underline    sublinhado (vazio)
```

O HTML tem o texto em caixa normal ("Rafael Torres", "Atacante"); a caixa alta vem do
CSS (`text-transform: uppercase`, desde o ch05). Do ch10 em diante os textos ficam vazios
no HTML e o JS preenche.

---

## ch04-html — a árvore (passo 1)

- Novo: só HTML, sem CSS. `index.html`.
- start: moldura + `.lt` com `.lt-ghost` e `.lt-kicker > .lt-role` prontos; comentário com a
  árvore. O leitor escreve `.lt-bar > .lt-name`, `.lt-sub` com os três spans e `.lt-underline`.
- Âncora existente que continua valendo: `start/index.html` `data-de="DOCTYPE" data-ate="^<body"`.
- Por que o nome tem elemento próprio dentro da placa: no ch14 ele sobe "de dentro" dela.
  Por que a função é um span dentro do kicker: no ch07 a placa inclina e o texto volta reto.

## ch05-css — cores, fontes, caixas (passo 2)

- Novo: `index.html` ganha DUAS linhas: `<link rel="stylesheet" href="tokens.css">` e
  `<link rel="stylesheet" href="style.css">`. O `tokens.css` (do designer, pronto, não se edita)
  tem os `@font-face` (Anton, Barlow Condensed 500/600/700) e as variáveis.
  O leitor não escreve `@font-face` nem hex: só usa `var(--…)`.
- Para citar o `@font-face` e as variáveis: `exercises/lower-third/ch05-css/solution/tokens.css`
  (`data-de="^@font-face" data-ate="^}"` pega o da Anton; `data-de="^:root" data-antes="Cores de significado"`
  pega as cores). `--accent: #c8f71d` é a cor que o operador troca (antes `--destaque`).
- Palco (pronto): `body` 1920 × 1080, `position: relative`, fundo = o "studio" do mini-controller.
- TODOs (style.css): 1 `.lt` font-family var(--font-data) · 2 `.lt-ghost` (display, --size-ghost,
  line-height 1, cor --accent) · 3 `.lt-kicker` (altura --h-strip, padding 0 26px 0 20px, fundo --accent)
  + `.lt-role` (--size-label, 700, --track-label, uppercase, --on-accent) · 4 `.lt-bar` (altura --h-bar,
  padding 0 120px 0 34px, fundo --ink) + `.lt-name` (display, --size-display, line-height 1.15,
  letter-spacing 0.015em, uppercase, --paper) · 5 `.lt-sub` (--h-strip, padding 0 26px, --primary)
  + `.lt-team, .lt-shirt` (--size-data, 600, --track-data, uppercase, --paper) · 6 `.lt-underline`
  (420px × --rule, --accent).
- Resultado: tudo empilhado no topo, esticado na largura toda; "9" enorme verde-limão em cima;
  texto colado no alto das placas (centralizar é flex, ch06); o ponto não aparece (span vazio).
- Linhas citáveis: `.lt-name {` … `}` (bom para a anatomia de regra); `.lt-bar {` … `}`.

## ch06-layout — no lugar (passo 3)

- Novo: position/absolute pela base, z-index, flex para centralizar, área de título.
- start: CSS do ch05 + o kicker e o sublinhado já posicionados (modelo) + 6 TODO:
  1 `.lt`: `position: absolute; left: var(--safe-x); bottom: var(--bottom-y); width: 820px; height: 190px;`
  2 `.lt-ghost`: `position: absolute; right: -10px; bottom: 16px; z-index: 0;`
  3 `.lt-bar`: `position: absolute; left: 0; bottom: 44px; z-index: 2; min-width: 600px; display: flex; align-items: center;`
  4 `.lt-name`: `white-space: nowrap;`
  5 `.lt-sub`: `position: absolute; left: 10px; bottom: 0; z-index: 1; display: flex; align-items: center; gap: 14px;`
  6 `.lt-dot`: `width: 7px; height: 7px; background: var(--accent);` (span vazio ganha tamanho dentro do flex)
- Modelo pronto: `.lt-kicker` (left 26px, bottom 136px, z-index 3, flex) e `.lt-underline` (left 10px, bottom -8px).
- Números: lower third a 96 px da esquerda e 96 px de baixo (antes 144/120). Camadas:
  fantasma 0, sub-barra 1, placa 2, kicker 3. Sem inclinação ainda; o fantasma é um 9 verde cheio
  ao lado/atrás da placa.
- Âncora sugerida (substitui `data-de="^\.lt \{" data-antes="^\.lt-nome-caixa"`):
  `data-de="^\.lt \{" data-antes="^/\* O número fantasma"` em `ch06-layout/solution/style.css`
  (pega a regra `.lt` com o comentário). Ou `.lt-bar`: `data-de="^\.lt-bar \{" data-ate="^}"`.

## ch07-drawing — o acabamento (passo 4)

- Novo: inclinação e contra-inclinação (skewX), corte seco com gradiente, `::before`, texto vazado
  (`-webkit-text-stroke`), opacidade, sombra dura com `filter: drop-shadow` (via `--shadow`).
- TODOs (start/style.css = solução do ch06 + comentários):
  1 `.lt`: `filter: var(--shadow);`
  2 `.lt-ghost`: `color: transparent; -webkit-text-stroke: 3px var(--accent); opacity: 0.28; transform: skewX(var(--skew));`
  3 `.lt-bar`: `background: linear-gradient(105deg, var(--ink) 78%, var(--ink-2) 78%);`
  4 `.lt-bar::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: var(--blade); background: var(--accent); }`
  5 o ângulo, duas regras no fim do arquivo:
    ```
    .lt-kicker, .lt-bar, .lt-sub, .lt-underline { transform: skewX(var(--skew)); transform-origin: left bottom; }
    .lt-role, .lt-name, .lt-team, .lt-dot, .lt-shirt { transform: skewX(var(--unskew)); }
    ```
    (no arquivo, um seletor por linha)
- O antigo TODO do filete (`border-bottom` em `.lt-cargo-caixa`) não existe mais: o "filete" agora
  é o `.lt-underline`, uma peça própria.
- Âncoras sugeridas em `ch07-drawing/solution/style.css`:
  - placa: `data-de="^\.lt-bar \{" data-ate="^}"` e lâmina `data-de="^\.lt-bar::before" data-ate="^}"`
  - fantasma: `data-de="^\.lt-ghost \{" data-ate="^}"`
  - ângulo: `data-de="^/\* O ângulo do sistema" data-ate="^}"` (primeira regra) ou
    `data-de="^/\* O ângulo do sistema"` até o fim do arquivo com `data-ate="skewX\(var\(--unskew\)\)" data-mais="1"` (confira o montar.ts).
- Exercício de DevTools que continua funcionando: em `.lt-bar`, `clip-path: inset(0 50% 0 0)` → 100% → 0%.
  "Confira" novo: mude `--accent` no `.lt` para `#ff3355`: lâmina, kicker, ponto, sublinhado e
  contorno do 9 mudam juntos.
- O resultado é idêntico ao da referência (`sample.html`, cena liga).

## ch10-js — o texto vem de fora (passo 5)

- `index.html`: textos vazios + `<script src="script.js"></script>` antes do `</body>`. CSS = ch07 sem mudança.
- `script.js`: objeto `data` e função `fill(d)`.
  ```
  const data = { name: 'Rafael Torres', role: 'Atacante', team: 'CD Meridian', number: 9, color: '#c8f71d' };
  function fill(d) { … }
  fill(data);
  ```
- start: `fill` só escreve o nome. TODO 1 `.lt-role` e `.lt-team` · TODO 2 o número em dois lugares
  (`.lt-ghost` ← `d.number`; `.lt-shirt` ← `` `CAMISA ${d.number}` ``) · TODO 3
  `lt.style.setProperty('--accent', d.color)` · TODO 4 no Console:
  `fill({ name: 'Marina Silveira', role: 'Treinadora', team: 'Atlético Oro', number: 1, color: '#ffb81c' })`
  · DESAFIO `fill({ name: 'Só o nome' })` → função e time viram "undefined", camisa "CAMISA undefined".
- solução: cada campo dentro de `if (d.x !== undefined)`.
- Âncora que continua: `data-de="^function fill" data-ate="^\}"` (antes `^function preencher`).
- Confira: `fill({ color: '#ff3355' })` deixa lâmina, kicker, ponto, sublinhado e o 9 vermelhos, sem mexer nos textos.

## ch14-gsap — entrada e saída (passo 6)

- `index.html`: `<script type="module" src="script.js">`. `lib/gsap/` dentro da pasta.
- CSS do ch07 com DUAS linhas novas (antes eram três):
  ```
  .lt     { … visibility: hidden; }   /* começa fora do ar */
  .lt-bar { … overflow: hidden; }     /* o nome entra de dentro da placa */
  ```
  O pivô do sublinhado (`transform-origin: left bottom`) já veio do ch07.
- `script.js`: elementos em constantes (`lt, ghost, kicker, role, bar, name, sub, team, shirt, underline`),
  `fill(d)`, `const closed = 'inset(0% 100% 0% 0%)'`, `const open = 'inset(0% 0% 0% 0%)'`,
  `function entrance()`, `function exit()`, teclas E/S, `window.entrance/exit/fill`.
- Posições ABSOLUTAS (instante em segundos), como a tabela do DESIGN.md §4:

  | faixa | de → para | início | duração | ease |
  |---|---|---|---|---|
  | `.set(lt, { autoAlpha: 1 })` | | 0 | | |
  | bar | clipPath closed → open | 0.08 | 0.55 | expo.out |
  | name | yPercent 115 → 0 | 0.2 | 0.6 | expo.out |
  | ghost | opacity 0, y 60 → opacity 0.28, y 0 | 0.3 | 0.6 | expo.out |
  | kicker (TODO 1) | clipPath closed → open | 0.32 | 0.45 | expo.out |
  | sub (TODO 2) | clipPath closed → open | 0.4 | 0.5 | expo.out |
  | underline (TODO 3) | scaleX 0 → 1 | 0.48 | 0.55 | expo.out |

  `entrance().duration()` = **1.03** (antes 1.4).
- Saída (TODO 4, inteira), `power3.in`, `gone = 'inset(0% 0% 0% 100%)'` (fecha para a direita):
  underline scaleX 0 (0, 0.25 s) · sub clip gone (0.03, 0.3) · kicker clip gone (0.06, 0.3) ·
  ghost opacity 0 (0.06, 0.3) · bar clip gone (0.1, 0.3) · `.set(lt, { autoAlpha: 0 })`.
  `exit().duration()` = **0.4** (antes 0.6).
- Âncora que continua: `data-de="^function entrance" data-ate="^\}"` (antes `^function entrada`).
  Saída: `data-de="^function exit" data-ate="^\}"`.
- Figura 14.2 (5 instantes): bons instantes são 0.15, 0.3, 0.45, 0.6 e 1.03 s.
- Exercício do ease: troque o ease da placa (`bar`) por `'back.out(1.7)'`/`'elastic.out'` e volte para `'expo.out'`.

## ch15-ograf — o pacote (passo 7, parte 1)

```
lower-third/
├── lower-third.ograf.json   (o leitor cria; só existe em solution/)
├── graphic.mjs
├── style.css                CSS do ch14 sem o palco (body) + 1 regra nova (abaixo)
├── tokens.css
├── thumbnail.png
├── fonts/
└── lib/gsap/
```
- `style.css` regra nova no topo: `.lt, .lt * { box-sizing: content-box; }` — a página é do
  renderizador e pode mudar o box-sizing (o mini-controller usa `* { box-sizing: border-box }`).
- `graphic.mjs` (start = solution; tem o defeito de propósito: responde antes do fim):
  - `const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;` e `CSS_URL` (style.css)
  - `const HTML = \`` com os DOIS `<link>` e a árvore
  - `function waitForCss(link)` (antes `esperarCss`), precedida de `// Espera o arquivo CSS terminar de carregar.`
  - `export default class LowerThird extends HTMLElement`
  - `async load({ data } = {})`: monta, `this.el = { lt, ghost, kicker, role, bar, name, sub, team, shirt, underline }`,
    `this.onAir = false`, espera os dois CSS (`Promise.all(links.map(waitForCss))`) e as fontes com
    `document.fonts.load('58px Anton')`, `'600 22px "Barlow Condensed"'`, `'700 20px "Barlow Condensed"'`
    (não mais `document.fonts.ready`), depois `this.applyData(data)`.
  - `playAction()` chama `this.entrance()`; `stopAction()` chama `this.exit()`; `updateAction({ data })`;
    `customAction({ id })` → 404; `dispose()` → `this.animation?.kill()`.
  - `applyData(data = {})` (antes `aplicar(dados)`), `entrance()`, `exit()`.
- Manifest: `"id": "takein.lower-third"`, `supportsNonRealTime: false`, schema
  `name` (Nome), `role` (Função), `team` (Time) — string single-line — e
  `number` (Camisa, `"type": "integer"`, minimum 1, maximum 99, default 9).
- Âncoras que continuam válidas (no ch16 solution): `data-de="^import" data-antes="^// Espera o arquivo"`,
  `data-de="── load" data-ate="^  \}"`. Âncora do manifest `data-de="^\{" data-antes='"thumbnails"'` ok.
- URL: `tools/mini-controller.html?manifest=../lower-third/ch15-ograf/solution/lower-third/lower-third.ograf.json`
  (parâmetro `manifest`, não `manifesto`). Campos no formulário: Nome, Função, Time, Camisa.
- Tempos: Play e Stop respondem em poucos ms; a entrada dura 1,03 s (≈1 s), a saída 0,4 s.

## ch16-ograf — o ciclo de vida + fora do tempo real (passo 7, parte 2)

- start: `graphic.mjs` do ch15 + `run()` e `timelineFor()` prontos + TODO:
  1 `playAction`: `this.onAir = true; await this.run(this.entrance(), skipAnimation);`
  2 `stopAction`: `this.onAir = false; await this.run(this.exit(), skipAnimation);`
  3 (desafio) update animado
  4 (desafio, 16.7) no `load`: `renderType`, `initialData`, `master`; escrever `setActionsSchedule` e
    `goToTime`; ligar `"supportsNonRealTime": true` no manifest (start ainda tem `false`).
- solution (é também o graphic.mjs do ch17), métodos na ordem do arquivo:
  - `async load({ data, renderType } = {})` — com o bloco
    ```
    this.renderType = renderType;
    this.initialData = data;
    if (renderType === 'non-realtime') {
      this.master = gsap.timeline({ paused: true });
    }
    ```
  - `async playAction({ goto, delta, skipAnimation } = {})` — `const step = goto ?? (this.onAir ? 0 : -1) + (delta ?? 1);`
  - `async stopAction({ skipAnimation } = {})` — `await this.run(this.exit(), skipAnimation);`
  - `async updateAction({ data, skipAnimation } = {})` — textos `[name, role, team, shirt]` somem
    (0,15 s) com o fantasma (`opacity: 0`, `'<'`), `.call(() => this.applyData(data))`, voltam (0,25 s),
    fantasma volta a 0.28. Total 0,4 s.
  - `customAction`, `dispose` (agora também `this.master?.kill()`)
  - `async setActionsSchedule({ schedule = [] } = {})` e `async goToTime({ timestamp })` —
    **idênticos ao código da seção 16.7** (mesmos comentários `// Volta ao começo…` e `// ...e anda até o instante…`).
  - `applyData(data = {})`, `async run(timeline, skipAnimation = false)` (antes `rodar`),
    `timelineFor({ type, params = {} })` (idêntico à 16.7), `entrance()`, `exit()`.
- Âncoras novas: `data-de="── stopAction" data-ate="^  \}"` (continua), `data-de="^  async run" data-ate="^  \}"`
  (antes `^  async rodar`), `data-de="── updateAction" data-ate="^  \}"` (continua).
  Para trocar os blocos de código colados da 16.7 por âncoras:
  `data-de="── setActionsSchedule" data-ate="^  \}"`, `data-de="── goToTime" data-ate="^  \}"`,
  `data-de="^  timelineFor" data-ate="^  \}"`, e no load `data-de="^    this.renderType" data-ate="^    \}"`.
- Manifest solution: `"supportsNonRealTime": true` (o ch17 herda).
- A agenda de exemplo da 16.7 usa `name: 'Marina Silveira'` (testado: play 0 / update 2000 /
  stop 4000 funciona, inclusive pedindo quadros fora de ordem).
- Tempos no log: Play ≈ **1030 ms**, Stop ≈ **400 ms**, Update no ar ≈ 400 ms, skipAnimation ≈ 0 ms.
- Mini-controller fora do tempo real: `…lower-third.ograf.json&render=non-realtime` (com `&auto=1&time=<ms>` para parar num instante).

## ch17-schema — o campo de cor (passo 7, parte 3)

- start = solução do ch16 (graphic, style, manifest com `supportsNonRealTime: true`).
- O leitor acrescenta ao schema:
  ```
  "color": {
    "type": "string",
    "title": "Cor de destaque",
    "gddType": "color-rrggbb",
    "pattern": "^#[0-9a-f]{6}$",
    "default": "#c8f71d"
  }
  ```
- Âncora: `data-de='"color": \{' data-ate="^      \}"` (antes `"cor"`).
- `applyData` já troca `--accent` desde o ch10/ch15. O seletor muda juntos: lâmina, kicker,
  ponto, sublinhado e o contorno do 9 (antes "a barra e o filete").
- O `number` (integer 1–99) já está no schema desde o ch15 e serve de exemplo de "Número com limites" (17.3).

## ch20-on-air — no ar (passo 8)

Só `README.md`. Usa `ch17-schema/solution/lower-third/`. O zip em `packages/lower-third.zip`
é de outro dono; hoje ele bate com esta pasta, fora os `Inter-Variable.woff2`/`LICENSE.txt`
sem uso, que ficaram fora do zip.
