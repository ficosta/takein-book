// Ferramentas de WebGL: compilar o shader, montar o programa e trazer
// as cores do tokens.css para o GLSL. Não dependem da cartela: servem
// para qualquer gráfico com um shader de tela cheia.

// O vértice: um triângulo grande que cobre a tela inteira, sem buffer
// nenhum. Os três cantos saem do número do vértice (0, 1 e 2).
export const FULL_SCREEN_VERTEX = `#version 300 es
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

// Compila um shader. Se o GLSL tiver erro, a mensagem do driver vai
// para a exceção: é ela que diz a linha e o problema.
function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Erro no shader: ${message}`);
  }
  return shader;
}

// Junta o vértice e o fragmento num programa, pronto para desenhar.
export function createProgram(gl, vertexSource, fragmentSource) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  // Depois de ligados, os shaders soltos não fazem mais falta.
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Erro ao ligar o programa: ${message}`);
  }
  return program;
}

// Lê um token de cor ("#c8f71d") e devolve [r, g, b] de 0 a 1,
// o formato de um vec3 no GLSL.
export function tokenColor(element, name) {
  const value = getComputedStyle(element).getPropertyValue(name).trim();
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (!hex) throw new Error(`O token ${name} não é uma cor #rrggbb: "${value}"`);
  const n = parseInt(hex[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
}
