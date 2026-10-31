# Capítulo 17 — O campo de cor

Acrescente ao `schema` do manifest o campo `color`:

- `"type": "string"`, `"title": "Cor de destaque"`
- `"gddType": "color-rrggbb"`
- `"pattern": "^#[0-9a-f]{6}$"` (exatamente assim: a spec exige)
- `"default": "#c8f71d"`

O `graphic.mjs` já sabe aplicar a cor (a variável `--accent`). Recarregue
o mini-controller e o seletor de cor aparece sozinho:

    tools/mini-controller.html?manifest=../lower-third/ch17-schema/start/lower-third/lower-third.ograf.json
