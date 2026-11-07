import { lookAt, multiplyMatrix, perspective } from './matrix.js';
import { sampleRoad } from '../engine/road.js';
import { makeWorldGeometry } from './geometry.js';

// This uses Expo GL's *native* OpenGL ES drawing target. No HTML, DOM,
// WebView, remote website, or browser JavaScript execution is involved.
const VERTEX_SHADER = [
  'attribute vec3 a_position;',
  'attribute vec3 a_color;',
  'uniform mat4 u_viewProjection;',
  'varying vec3 v_color;',
  'varying float v_fog;',
  'void main() {',
  '  vec4 clip = u_viewProjection * vec4(a_position, 1.0);',
  '  gl_Position = clip;',
  '  v_color = a_color;',
  '  v_fog = clamp((clip.w - 85.0) / 350.0, 0.0, 1.0);',
  '}',
].join('\n');

const FRAGMENT_SHADER = [
  'precision mediump float;',
  'varying vec3 v_color;',
  'varying float v_fog;',
  'void main() {',
  '  vec3 sky = vec3(0.56, 0.71, 0.80);',
  '  gl_FragColor = vec4(mix(v_color, sky, v_fog), 1.0);',
  '}',
].join('\n');

function createShader(gl, shaderType, source) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('SlowRoads native shader compilation failed: ' + error);
  }
  return shader;
}

function createProgram(gl) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('SlowRoads native program failed to link: ' + error);
  }
  return program;
}

export function createNativeRenderer(gl) {
  const program = createProgram(gl);
  const buffer = gl.createBuffer();
  const position = gl.getAttribLocation(program, 'a_position');
  const color = gl.getAttribLocation(program, 'a_color');
  const matrix = gl.getUniformLocation(program, 'u_viewProjection');
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;
  if (!buffer || width <= 0 || height <= 0) {
    throw new Error('Native OpenGL ES buffer unavailable');
  }
  gl.viewport(0, 0, width, height);
  gl.clearColor(0.56, 0.71, 0.80, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.CULL_FACE);

  let disposed = false;
  function render(state) {
    if (disposed) return;
    const p = sampleRoad(state.z);
    const centerX = p.x + state.lane;
    const eye = [centerX, p.y + 4.1, state.z - 10.5];
    const focus = sampleRoad(state.z + 24);
    const target = [focus.x + state.lane * 0.5, focus.y + 1.25, state.z + 24];
    const view = lookAt(eye, target);
    const projection = perspective(Math.PI / 3.2, width / height, 0.1, 650);
    const viewProjection = multiplyMatrix(projection, view);
    const vertices = makeWorldGeometry(state);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 24, 12);
    gl.uniformMatrix4fv(matrix, false, viewProjection);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 6);
    gl.flush();
    gl.endFrameEXP();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  }

  return { render, dispose };
}
