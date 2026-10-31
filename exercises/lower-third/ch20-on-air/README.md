# Capítulo 20 — No ar no edge.playout

Este passo não tem código. Use o pacote que você terminou no capítulo 17
(ou o gabarito em `lower-third/ch17-schema/solution/lower-third/`).

1. **Empacotar** — no Finder, botão direito na pasta `lower-third` → Comprimir.
   Ou, no Terminal, de dentro da pasta que contém `lower-third/`:

       zip -r lower-third.zip lower-third -x '*.DS_Store'

   Não coloque `index.html` dentro do pacote.

2. **Validar** — arraste o zip em https://ograf.dev/check

3. **Instalar** — `http://localhost:4310/admin` → Templates → envie o zip.

4. **Operar** — `http://localhost:4310/controller`: rundown, campos (nome, função, time, camisa e cor), preview, tocar e parar.
   A saída é `http://localhost:4310/renderer?screen=output-1`.

Um zip pronto e testado está em `packages/lower-third.zip`, na raiz do treinamento.
