# Capítulo 15 — A lower third vira um pacote OGraf

A pasta `lower-third/` já tem quase tudo: o `tokens.css`, o `style.css`,
as fontes, o GSAP, a miniatura e o `graphic.mjs`. Falta o **manifest**.

1. Crie o arquivo `lower-third/lower-third.ograf.json`.
2. Escreva o manifest seguindo a seção 15.3 do livro, com o `id`
   `takein.lower-third` e quatro campos no `schema`: `name`, `role` e
   `team` (`single-line`) e `number` (`integer`, de 1 a 99).
   Por enquanto, copie o `schema` da solução: o capítulo 17 explica cada linha.
3. Abra no mini-controller (pelo Live Server, na pasta `exercises/`):

       tools/mini-controller.html?manifest=../lower-third/ch15-ograf/start/lower-third/lower-third.ograf.json

Clique em Load, Play e Stop. Olhe o tempo que o Stop leva no log.
