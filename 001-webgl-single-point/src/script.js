console.log("hello, script first line!");

// Vertex Shader source-code
// Runs once per vertex
const vsSource = `
precision mediump float;
void main(void) {
  // Vertex position
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  // Screen pixel size
  gl_PointSize = 40.0;
}
`;

// Fragment Shader source-code
// Runs once per fragment/pixel
const fsSource = `
precision mediump float;
void main(void) {
    // Draw all pixels using red color
    gl_FragColor = vec4(gl_FragCoord.x, 0.0, 0.0, 1.0);
}
`;

window.onload = () => {
  console.log("window.onLoad() called");
  setup();
};

function setup() {
  // Get canvas from DOM
  const canvas = document.getElementById("mycanvas");
  canvas.width = 600;
  canvas.height = 600;

  // Get webgl v1 context
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Error getting webgl context");
    return null;
  }

  // Create programs
  const program = gl.createProgram();

  // Vertex shader
  const vsShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vsShader, vsSource);
  gl.compileShader(vsShader);
  if (!gl.getShaderParameter(vsShader, gl.COMPILE_STATUS)) {
    alert("Error compiling vertex shader");
    console.log(gl.getShaderInfoLog(vsShader));
    return null;
  }
  gl.attachShader(program, vsShader);
  console.log("Vertex shader compiled");

  // Fragment shader
  const fsShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fsShader, fsSource);
  gl.compileShader(fsShader);
  if (!gl.getShaderParameter(fsShader, gl.COMPILE_STATUS)) {
    alert("Error compiling fragment shader");
    console.log(gl.getShaderInfoLog(fsShader));
    return null;
  }
  gl.attachShader(program, fsShader);
  console.log("Fragment shader compiled");

  // Link program
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Error linking program");
    console.log(gl.getProgramInfoLog(program));
    return null;
  }
  console.log("GPU program linked");

  // Use program
  gl.useProgram(program);

  // Set viewport size
  gl.viewport(0, 0, canvas.width, canvas.height);
  //  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // Clear buffer
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw, trigger the shaders
  const firstIndex = 0;
  const count = 1; // call vertex shader 1 time
  gl.drawArrays(gl.POINTS, firstIndex, count);

  // Return and finish script, never render again
}
