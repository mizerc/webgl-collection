window.onload = () => {
  setup();
};

const vsSource = `
precision mediump float;
attribute vec4 a_position;
void main(void) {
  gl_Position = a_position;
  gl_PointSize = 20.0;
}
`;

const fsSource = `
precision mediump float;
uniform vec4 u_color;
void main(void) {
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = u_color;
}
`;

const COLOR_LIST = [
  [1.0, 0.0, 0.0, 1.0], // red
  [0.0, 1.0, 0.0, 1.0], // green
  [0.0, 0.0, 1.0, 1.0], // blue
  [1.0, 1.0, 0.0, 1.0], // yellow
  [0.0, 1.0, 1.0, 1.0], // cyan
  [1.0, 0.0, 1.0, 1.0], // magenta
];

function setup() {
  // Get canvas from DOM
  const canvas = document.getElementById("mycanvas");
  canvas.width = 600;
  canvas.height = 600;

  // Get webgl context version 1
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Error: Unable to initialize WebGL");
    return null;
  }
  console.log("Webgl context adquired");

  // Compile vertex shader
  const vsShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vsShader, vsSource);
  gl.compileShader(vsShader);
  if (!gl.getShaderParameter(vsShader, gl.COMPILE_STATUS)) {
    console.log("Error trying compile vertex shader");
    console.log(gl.getShaderInfoLog(vsShader));
    return null;
  }
  console.log("Vertex shader compiled");

  // Compile fragment shader
  const fsShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fsShader, fsSource);
  gl.compileShader(fsShader);
  if (!gl.getShaderParameter(fsShader, gl.COMPILE_STATUS)) {
    console.log("Erro trying compile fragment shader");
    console.log(gl.getShaderInfoLog(fsShader));
    return null;
  }
  console.log("Fragment shader compiled");

  // Create program
  const gpuProgram = gl.createProgram();

  // Attach shaders to program
  gl.attachShader(gpuProgram, vsShader);
  gl.attachShader(gpuProgram, fsShader);

  // Link program
  gl.linkProgram(gpuProgram);
  if (!gl.getProgramParameter(gpuProgram, gl.LINK_STATUS)) {
    console.log("Error linking shader program");
    console.log(gl.getProgramInfoLog(gpuProgram));
    return null;
  }
  console.log("GPU program linked");

  // Use program
  gl.useProgram(gpuProgram);
  console.log("GPU program actived");

  // Set viewport
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Read current viewport
  const currentViewport = gl.getParameter(gl.VIEWPORT);
  console.log(`currentViewport: ${currentViewport}`);

  // Get uniform location
  const u_color = gl.getUniformLocation(gpuProgram, "u_color");
  if (u_color == null) {
    console.log("Error getting uniform location");
    return null;
  }

  // Get attribute location
  const a_position = gl.getAttribLocation(gpuProgram, "a_position");
  if (a_position == -1) {
    console.log("Error getting attribute location");
    return null;
  }

  // Keep list of added points and colors
  const jsScreenPoints = [[0.0, 0.0]];
  const jsScreenColors = [[1.0, 1.0, 0.0, 0.0]];

  // Paint
  function paint() {
    console.log("PAINT CALLED");
    // Clear buffer
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    for (let i = 0; i < jsScreenPoints.length; i++) {
      const px = jsScreenPoints[i][0];
      const py = jsScreenPoints[i][1];
      const pcolor = jsScreenColors[i];
      console.log(`Drawing p(${px},${py}, ${pcolor})`);

      // Write click position to vec4nattribute inside the shader
      gl.vertexAttrib2f(a_position, px, py);

      // Write color to uniform location (vec4, rgba)
      gl.uniform4fv(u_color, pcolor);

      // Request draw call
      const firstIndex = 0;
      const count = 1; // call vertex shader 1 time
      gl.drawArrays(gl.POINTS, firstIndex, count);
    }
  }
  paint();

  // Register a onClick callback
  canvas.addEventListener("click", (event) => {
    const t0 = performance.now();

    // Grab click position
    const x = event.clientX;
    const y = event.clientY;

    // Transform from dom to canvas coordinates (origin top-left)
    const rect = event.target.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    // Transform to webgl coordinates (origin at center)
    const webglX = (canvasX / canvas.width) * +2 - 1;
    const webglY = (canvasY / canvas.height) * -2 + 1;

    // Store point to draw later
    jsScreenPoints.push([webglX, webglY]);

    const randomCircularIndex = jsScreenPoints.length % COLOR_LIST.length;
    jsScreenColors.push(COLOR_LIST[randomCircularIndex]);

    // Redraw each point
    paint();

    // Print stats
    const t1 = performance.now();
    const totalTimeMs = t1 - t0;
    console.log(
      `Draw time: ${totalTimeMs}ms. Points.len: ${jsScreenPoints.length}`
    );
  });
}
