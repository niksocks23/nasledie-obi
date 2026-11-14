export function initHeroShader() {
  const canvas = document.getElementById('hero-shader');
  if (!canvas) return; // Защита, если элемента нет

  const gl = canvas.getContext('webgl');
  if (!gl) return;

  function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  const vs = `
    attribute vec2 pos;
    void main() { gl_Position = vec4(pos, 0.0, 1.0); }
  `;
  const fs = `
    precision highp float;
    uniform float time;
    uniform vec2 resolution;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      
      float wave1 = sin(uv.x * 8.0 + time) * 0.1;
      float wave2 = cos(uv.y * 6.0 + time * 0.8) * 0.1;
      float wave3 = sin((uv.x + uv.y) * 10.0 + time * 1.5) * 0.05;
      
      vec3 color1 = vec3(0.1, 0.3, 0.8);
      vec3 color2 = vec3(0.5, 0.2, 0.8);
      
      float mixer = (sin(time * 0.5 + uv.x * 3.0) + 1.0) / 2.0;
      vec3 finalColor = mix(color1, color2, mixer);
      
      float glow = (wave1 + wave2 + wave3) * 2.0;
      finalColor += glow * 0.5;
      
      gl_FragColor = vec4(finalColor, 0.3);
    }
  `;

  function createShader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'pos');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const timeLoc = gl.getUniformLocation(prog, 'time');
  const resLoc = gl.getUniformLocation(prog, 'resolution');

  function render(t) {
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLoc, t * 0.001);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}