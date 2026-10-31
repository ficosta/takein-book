# Capítulo 21 — O sistema visual

A pasta `news/` é o pacote de news, ainda com um gráfico só: a
**vitrine** (`showcase`), que mostra as cores e as fontes do
`tokens.css`.

1. Abra a vitrine no mini-controller:

       tools/mini-controller.html?manifest=../ch21-news/start/news/showcase.ograf.json

2. Ela sai roxa e verde-limão, escrito PELE LIGA: são os valores do
   `:root`, a pele padrão do `tokens.css`.
3. Em `base.mjs`, faça o `TODO`: acrescente `data-skin="news"` na
   `<div class="news">`. Recarregue. As mesmas variáveis agora têm os
   valores do bloco `[data-skin="news"]`: azul-marinho e âmbar.
4. Quer a cor do seu canal? Troque os valores do bloco
   `[data-skin="news"]` no `tokens.css` do seu pacote e recarregue.
   Nenhum gráfico precisa mudar.
