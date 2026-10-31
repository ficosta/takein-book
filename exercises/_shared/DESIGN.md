# Sistema visual e convenções dos exemplos

Todos os gráficos do livro seguem este documento. As cores, fontes, medidas e
tempos estão em `tokens.css`. Aqui ficam as regras de uso e os nomes.

A base é a geometria do pacote Volt Liga: um ângulo só, cor chapada, cantos
retos, sombra dura e tudo ancorado na área de título. A amostra aprovada está em
`reference/sample.html` (abra pelo servidor: `npm run servidor`).

## 1. Regras de desenho

1. **Um ângulo só: `--skew` (−12°).** Toda placa é inclinada com
   `transform: skewX(var(--skew))`. O texto dentro dela volta a ficar reto com
   `skewX(var(--unskew))`. Nada de outros ângulos, nada de `border-radius`
   (a única exceção é o ponto redondo do AO VIVO).
2. **Cor chapada, só dos tokens.** Sem degradê suave, sem desfoque, sem
   transparência decorativa. A divisão `ink`/`ink-2` da barra é um corte seco
   (`linear-gradient(105deg, var(--ink) 78%, var(--ink-2) 78%)`).
3. **Profundidade com sombra dura**: `filter: var(--shadow)` no container do
   gráfico, nunca em cada placa.
4. **Destaque em três lugares, sempre os mesmos**: a lâmina de 10 px na borda
   esquerda da placa principal, o kicker e o sublinhado de 4 px.
5. **Número vazado atrás** (o "fantasma"): Anton em `--size-ghost`,
   `color: transparent`, `-webkit-text-stroke: 3px var(--accent)`,
   `opacity: 0.28`, inclinado como as placas, atrás de tudo (`z-index: 0`).
   Aparece onde existe um número ou sigla de verdade: camisa do jogador,
   minuto, sigla do estado no locator.
6. **Escala de tipo fechada.** Só os tamanhos `--size-*` do `tokens.css`.
   Anton (`--font-display`) para nomes, números e títulos. Barlow Condensed
   (`--font-data`) para todo o resto. Rótulos em caixa alta com
   `letter-spacing: var(--track-label)`.
7. **Alturas fechadas.** Placa de nome 92 px, tudo na linha de cima 62 px,
   faixas (kicker, sub-barra, linha de tabela) 40 px.
8. **Texto centralizado na vertical** dentro da placa com flex
   (`display: flex; align-items: center`), nunca com padding chutado.
9. **Números tabulares** onde dígitos mudam ou se alinham
   (`font-variant-numeric: tabular-nums`): relógio, placar, tabela, cotação.

## 2. Onde cada gráfico fica (1920 × 1080)

Tudo se apoia na área de título: 96 px das laterais, 54 px do topo.

| Posição | Âncora | Gráficos |
|---|---|---|
| Linha de cima, esquerda | `left: 96px; top: 54px` | placar (scorebug) |
| Linha de cima, direita | `right: 96px; top: 54px` | bug AO VIVO, relógio, logo |
| Linha de baixo, esquerda | `left: 96px; bottom: 96px` | lower third, kicker, nota de rodapé |
| Linha de baixo, direita | `right: 96px; bottom: 96px` | locator, hashtag, cotação |
| Tela cheia | centralizado; conteúdo até 1440 px de largura | tabela, cartela, vitrine, previsão, nota oficial |
| Faixa | `left: 0; right: 0; bottom: 54px` | ticker |

Placa inclinada ancorada à direita usa `transform-origin: right top`, para a
inclinação entrar na área segura em vez de sair dela. Ancorada à esquerda usa
`transform-origin: left bottom`.

## 3. A lower third de referência

```
.lt                    container: left 96, bottom 96, 820 × 190, filter: var(--shadow)
├─ .lt-ghost           o número vazado (camisa)
├─ .lt-kicker          faixa de destaque: a função (ATACANTE)
├─ .lt-bar             placa do nome, 92 px, lâmina à esquerda (::before)
│  └─ .lt-name         o nome, Anton 58 px
├─ .lt-sub             faixa primária: time · camisa
└─ .lt-underline       sublinhado de 4 px
```

O CSS final está em `reference/sample.html`.

## 4. Movimento

| | Entrada | Saída |
|---|---|---|
| Curva | `expo.out` (`--ease-in`) | `power3.in` (`--ease-out`) |
| Duração total | ~1,0 s | ~0,4 s |
| Ordem | placa principal → texto → fantasma → faixas → sublinhado | tudo junto, na ordem inversa |

Entrada da lower third (início, duração):

| Peça | Início | Duração | Movimento |
|---|---|---|---|
| `.lt-bar` | 0,08 s | 0,55 s | revela da esquerda para a direita (`clip-path: inset(0 100% 0 0)` → `inset(0)`) |
| `.lt-name` | 0,20 s | 0,60 s | sobe de dentro da placa (`yPercent: 115` → 0, placa com `overflow: hidden`) |
| `.lt-ghost` | 0,30 s | 0,60 s | aparece subindo 60 px (`opacity` 0 → 0.28) |
| `.lt-kicker` | 0,32 s | 0,45 s | revela da esquerda |
| `.lt-sub` | 0,40 s | 0,50 s | revela da esquerda |
| `.lt-underline` | 0,48 s | 0,55 s | `scaleX` 0 → 1, origem à esquerda |

Os outros gráficos usam o mesmo vocabulário: placa revela pela esquerda,
texto sobe de dentro, número/fantasma sobe e aparece, sublinhado varre.

## 5. Nomes em inglês

Código em inglês: pastas, arquivos, classes CSS, ids, variáveis, funções,
classes JS, elementos customizados, ids de manifest, chaves de schema e ids de
ação. Comentários do código e textos que aparecem para o operador ou no ar
continuam em português (`"title": "Nome"`, `AO VIVO`).

Nomes que se repetem no livro inteiro:

| Antes | Agora |
|---|---|
| `inicio/`, `solucao/` | `start/`, `solution/` |
| `entrada()`, `saida()` | `entrance()`, `exit()` |
| `aplicar(dados)` | `applyData(data)` |
| `mostrar(d)` | `render(data)` |
| `trocar(d)` | `swap(data)` |
| `preencher(d)` | `fill(data)` |
| `rodar(timeline, skip)` | `run(timeline, skip)` |
| `preparar()` | `setup()` |
| `esperarCss(link)` | `waitForCss(link)` |
| `totalPassos()`, `trocarPasso(p)` | `stepCount()`, `goToStep(step)` |
| `acoes` | `actions` |
| `aoDescartar()` | `onDispose()` |
| `noAr`, `passo`, `dados`, `raiz` | `onAir`, `step`, `data`, `root` |
| `GraficoNews` | `NewsGraphic` |
| `cartao-nome`, `tarja-urgente`, `ograf-grafico` | `name-card`, `urgent-strap`, `ograf-graphic` |
| ids `livro.*` | ids `takein.*` |
| `nome`, `cargo`, `cor`, `titulo`, `tema` | `name`, `role`, `color`, `title`, `theme` |
| `numero`, `time`, `casa`, `fora` | `number`, `team`, `home`, `away` |
| `situacao`: `ao-vivo` / `gravado` / `reprise` | `status`: `live` / `recorded` / `rerun` |
| `pontos`, `jogos`, `vitorias`, `saldo` | `points`, `played`, `wins`, `goalDiff` |
| `--destaque`, `--cor-*` | `--accent` e os tokens deste sistema |
| prefixos CSS `.lt-nome`, `.lt-cargo`, `.pl-*` | `.lt-name`, `.lt-role`, `.sb-*` (scoreboard) |
| mini-controlador (`?manifesto=&fundo=&captura=`) | mini-controller (`?manifest=&background=&capture=`) |

Prefixos de classe por gráfico: `lt-` lower third, `sb-` placar, `bug-`,
`clk-` relógio, `kck-` kicker, `loc-` locator, `tag-` hashtag, `tbl-` tabela,
`card-` cartela, `fx-` cotação, `wx-` previsão, `st-` nota oficial,
`strap-` tarja urgente.

## 6. Dados de exemplo (os mesmos no livro inteiro)

| Uso | Dados |
|---|---|
| Lower third (fio do livro) | Rafael Torres · Atacante · CD Meridian · camisa 9 |
| Segunda pessoa | Marina Silveira · Treinadora · Atlético Oro |
| Jogo | CD Meridian (MER) × Atlético Oro (ATL), Volt Liga, 2 × 1, 2º tempo |
| Liga | Volt Liga, sigla VL. Outros times: AUR, NOR, VAL, POR |
| Escalação do CD Meridian | 1 Diego Paredes, 2 Lucas Almeida, 4 Thiago Rocha, 3 Bruno Castelo, 6 Caio Ferraz, 5 Mateus Lira, 8 Gustavo Prado, 10 Enzo Batista, 11 Felipe Amaral, 7 Vitor Sampaio, 9 Rafael Torres |
| Jornalismo | Ana Souza · Repórter · São Paulo (SP) |
| Canal | "AO VIVO", relógio 19:42 |

## 7. Pacotes

- Cada pacote OGraf é autocontido: leva `tokens.css`, a pasta `fonts/` (com os
  dois arquivos `OFL-*.txt`) e `lib/gsap/` copiados de `_shared/`. Não edite as
  cópias; edite `_shared/` e copie de novo.
- Miniaturas (`thumbnail.png`, `thumbnails/*.png`): 960 × 540, o gráfico no
  estado final sobre o fundo `studio` do mini-controller.
