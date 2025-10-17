const SIZE = 600;

class Triangle {
  constructor(gl) {
    this.gl = gl;

    // Vertex data for one triangle
    this.vertices = new Float32Array([
      0.0,
      0.8, // top
      -0.8,
      -0.6, // bottom-left
      0.8,
      -0.6, // bottom-right
    ]);

    // Create and upload the vertex buffer
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
  }

  render(a_pos, vertexCount = 3) {
    const gl = this.gl;

    // Bind this triangle's buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

    // Tell WebGL how to read the data for this attribute
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_pos);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  }
}

class App {
  constructor(canvas) {
    this.init(canvas);
  }

  async init(canvas) {
    let t0 = performance.now();

    const wgl = new Webgl_v1(canvas);
    await wgl.loadFragmentShader("fragment-shader");
    await wgl.loadVertexShader("vertex-shader");
    wgl.compiledVertexShader();
    wgl.compiledFragmentShader();
    wgl.createGpuProgram();

    console.log("Setup 1: " + (performance.now() - t0) + " milliseconds.");
    t0 = performance.now();

    wgl.createBuffer("BUFFER_TRIANGLE_1");
    wgl.enableBuffer("BUFFER_TRIANGLE_1");
    wgl.populateBuffer(
      "BUFFER_TRIANGLE_1",
      // x, y, r, g, b
      // 5 floats per vertex, 4 bytes per float
      // prettier-ignore
      new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0,  // 0,0 red
      -5.0, -1.0, 0.0, 1.0, 0.0, // -1,-1 green
       0.8, -0.6, 0.0, 0.0, 1.0, // 0.8,-0.6 blue
    ])
    );

    wgl.createBuffer("BUFFER_TRIANGLE_2");
    wgl.enableBuffer("BUFFER_TRIANGLE_2");
    wgl.populateBuffer(
      "BUFFER_TRIANGLE_2", // x, y, r, g, b
      // 5 floats per vertex, 4 bytes per float
      // prettier-ignore
      new Float32Array([
      1.0, 1.0, 1.0, 0.0, 0.0,  // 0,0 red
      -1.0, -1.0, 1.0, 1.0, 0.0, // -1,-1 green
       0.8, -0.6, 0.0, 0.0, 1.0, // 0.8,-0.6 blue
    ])
    );

    // createAttributeVariable(attributVarName, NUMBER_OF_FLOATS, OFFSET_BYTES, STRIDE_BYTES)
    const FLOAT_SIZE = 4;
    wgl.createAttributeVariable("a_position");
    wgl.enableAttributeVariable("a_position");

    wgl.createAttributeVariable("a_color");
    wgl.enableAttributeVariable("a_color");

    console.log("Setup 2: " + (performance.now() - t0) + " milliseconds.");
    t0 = performance.now();

    wgl.clearFrameBuffer();

    console.log("Clear: " + (performance.now() - t0) + " milliseconds.");
    t0 = performance.now();

    wgl.enableBuffer("BUFFER_TRIANGLE_1");
    wgl.configureHowToParseAttributeVariable(
      "a_position",
      2,
      0 * FLOAT_SIZE,
      5 * FLOAT_SIZE
    );
    wgl.configureHowToParseAttributeVariable(
      "a_color",
      3,
      2 * FLOAT_SIZE,
      5 * FLOAT_SIZE
    );
    wgl.draw(3);

    console.log("First draw: " + (performance.now() - t0) + " milliseconds.");
    t0 = performance.now();

    wgl.enableBuffer("BUFFER_TRIANGLE_2");
    wgl.configureHowToParseAttributeVariable(
      "a_position",
      2,
      0 * FLOAT_SIZE,
      5 * FLOAT_SIZE
    );
    wgl.configureHowToParseAttributeVariable(
      "a_color",
      3,
      2 * FLOAT_SIZE,
      5 * FLOAT_SIZE
    );
    wgl.draw(3);

    console.log("Second draw: " + (performance.now() - t0) + " milliseconds.");
    t0 = performance.now();
  }
}
