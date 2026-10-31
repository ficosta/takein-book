#version 300 es
// Fundo da cartela: o shader de fragmento.
//
// Este programa roda uma vez para cada pixel da tela, todos ao mesmo
// tempo, na placa de vídeo. Ele recebe a posição do pixel e devolve
// uma cor. Não sabe nada do pixel do lado nem do quadro anterior:
// tudo o que muda chega pelos uniforms.

precision highp float;

uniform vec2 u_resolution;   // 1920, 1080
uniform float u_time;        // segundos: o relógio que o gráfico manda
uniform float u_reveal;      // entrada: 0 (nada) → 1 (tela coberta)
uniform float u_exit;        // saída:   0 (coberta) → 1 (nada)

// As cores do tokens.css, convertidas para 0 a 1 pelo JavaScript.
uniform vec3 u_ink;
uniform vec3 u_ink2;
uniform vec3 u_primary;
uniform vec3 u_accent;

out vec4 outColor;

const float SKEW = 0.2126;   // tan(12°): o ângulo do sistema
const float BAND = 160.0;    // largura de cada lâmina, em px
const float BLADE = 18.0;    // a lâmina de destaque na frente da varredura
const float REACH = BAND + 2.0 * BLADE + 2.0; // o caminho todo de uma lâmina

// Um número "aleatório" entre 0 e 1, sempre o mesmo para o mesmo n.
float hash(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}

// Ruído: valores aleatórios em cada inteiro, ligados por uma curva.
// Muda devagar e sem saltos, ao contrário do hash.
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}

// 1 à esquerda da borda, 0 à direita, com um pixel de transição:
// a borda fica reta e dura, sem serrilhado.
float before(float x, float edge) {
  return clamp(edge - x + 0.5, 0.0, 1.0);
}

// O avanço de cada lâmina: todas andam juntas, mas cada uma sai com
// um pequeno atraso, da esquerda para a direita, com um sorteio.
float bandProgress(float band, float t) {
  float delay = band * 0.02 + hash(band) * 0.12;
  float p = clamp((t - delay) / 0.6, 0.0, 1.0);
  return 1.0 - pow(1.0 - p, 3.0);
}

// O desenho da tela coberta: tinta, faixas finas que andam devagar
// e uma placa primária na direita, atrás do número vazado.
vec3 plate(float s) {
  vec3 color = u_ink;

  // Faixas de ink-2: o ruído decide onde há faixa, e o tempo empurra
  // o desenho para a direita, 24 px por segundo.
  float drift = s - u_time * 24.0;
  float stripes = step(0.66, noise(drift / 46.0));
  color = mix(color, u_ink2, stripes);

  // A placa primária: tudo à direita da linha s = 1560, com a
  // lâmina de destaque de 10 px na borda, como na lower third.
  float slab = 1.0 - before(s, 1560.0);
  float blade = slab * before(s, 1570.0);
  color = mix(color, u_primary, slab);
  color = mix(color, u_accent, blade);
  return color;
}

void main() {
  // Pixel com y para baixo, como no CSS (no WebGL, y cresce para cima).
  vec2 px = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);

  // A coordenada inclinada: ao longo de uma linha a −12°, s não muda.
  float s = px.x + px.y * SKEW;
  float band = floor(s / BAND);
  float x = s - band * BAND;           // de 0 a BAND dentro da lâmina

  // TODO 3: a varredura (seção 30.5).
  // 1. front e back: onde está a frente da entrada e o fundo da
  //    saída nesta lâmina (bandProgress × REACH).
  // 2. covered (entre back e front) e body (o coberto sem as lâminas).
  // 3. A cor: destaque na lâmina, plate(s) no corpo, e a saída
  //    pré-multiplicada: vec4(color * covered, covered).
  // Por enquanto, a tela inteira coberta, sem animação:
  outColor = vec4(plate(s), 1.0);
}
