const SIZE = 600;

class Rectangle {
  constructor(wgl) {
    this.wgl = wgl;
    this.id = wgl.getUniqueId();
    this.setup();
  }
  static getVertexes() {
    // 6 VERTEXES x 3 FLOATS (RGB)
    // prettier-ignore
    return new Float32Array([
    // 6 vertices × 3 floats (RGB)
    // Triangle 1 (counter-clockwise winding)
    0.0, 1.0, 0.0,  // top-left => green
    1.0, 0.0, 0.0,  // top-right => red
    0.0, 0.0, 1.0,  // bottom-left => blue
    // Triangle 2 (clockwise winding)
    1.0, 0.0, 0.0,  // top-right => red
    0.0, 0.0, 1.0,  // bottom-right => blue
    0.0, 1.0, 0.0,  // bottom-left => green
      ])
  }
  setup() {
    const wgl = this.wgl;

    wgl.createBuffer(`RECT_POSITION_${this.id}`);
    wgl.createBuffer(`RECT_COLOR_${this.id}`);

    // POPULATE COLOR BUFFER
    wgl.bindGpuArrayPointer(`RECT_COLOR_${this.id}`);
    wgl.populateGpuArrayPointer(Rectangle.getVertexes());
    wgl.bindGpuArrayPointer(`RECT_POSITION_${this.id}`);
    // prettier-ignore
    wgl.populateGpuArrayPointer(new Float32Array([
      // Triangle 1, 2 floats per vertex, X,Y
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
      // Triangle 2
       1.0,  1.0, // top-right
       1.0, -1.0, // bottom-right
      -1.0, -1.0,
    ]));
  }

  render() {
    const wgl = this.wgl;

    wgl.bindGpuArrayPointer(`RECT_POSITION_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_position", 2, 0, 0);

    wgl.bindGpuArrayPointer(`RECT_COLOR_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_color", 3, 0, 0);

    // DRAW
    wgl.draw(6);
  }
}

class Cube {
  constructor(wgl) {
    this.wgl = wgl;
    this.id = wgl.getUniqueId();
    this.setup();
  }

  setup() {
    const wgl = this.wgl;

    // === CREATE BUFFERS ===
    wgl.createBuffer(`CUBE_POSITION_${this.id}`);
    wgl.createBuffer(`CUBER_COLOR${this.id}`);
    wgl.createBuffer(`CUBE_INDEX_${this.id}`);

    // === POPULATE POSITION BUFFER ===
    wgl.bindGpuArrayPointer(`CUBE_POSITION_${this.id}`);
    // 8 VERTEXES, EACH WITH X,Y,Z, 3 FLOATS
    wgl.populateGpuArrayPointer(
      // prettier-ignore
      new Float32Array([
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
      ])
    );

    // === POPULATE COLOR BUFFER ===
    // 3 VERTEX COLORS, EACH WITH R,G,B, 3 FLOATS
    wgl.bindGpuArrayPointer(`CUBER_COLOR${this.id}`);
    wgl.populateGpuArrayPointer(
      // prettier-ignore
      new Float32Array([
        // Front face – red
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        // Back face – green
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
      ])
    );

    // === POPULATE INDEX BUFFER ===
    wgl.bindGpuIndexPointer(`CUBE_INDEX_${this.id}`);
    wgl.populateGpuIndexPointer(
      `CUBE_INDEX_${this.id}`,
      // prettier-ignore
      new Uint16Array([
      0, 1, 2,  0, 2, 3,   // front
      4, 5, 6,  4, 6, 7,   // back
      3, 2, 6,  3, 6, 5,   // top
      0, 7, 1,  0, 4, 7,   // bottom
      1, 7, 6,  1, 6, 2,   // right
      0, 3, 5,  0, 5, 4    // left
    ])
    );
  }

  render() {
    const wgl = this.wgl;

    // BIND POSITION
    wgl.bindGpuArrayPointer(`CUBE_POSITION_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_position", 3, 0, 0);

    // BIND COLOR
    wgl.bindGpuArrayPointer(`CUBER_COLOR${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_color", 3, 0, 0);

    // BIND INDICES AND DRAW
    wgl.bindGpuIndexPointer(`CUBE_INDEX_${this.id}`);
    wgl.drawUsingIndices(36);
  }
}

class Triangle {
  constructor(wgl) {
    this.wgl = wgl;
    this.id = wgl.getUniqueId();
    this.setup();
  }
  setup() {
    const wgl = this.wgl;

    // CREATE BUFFER FOR TRIANGLE POSITION, COLOR, INDICES
    wgl.createBuffer(`BUFFER_POSITION_${this.id}`);
    wgl.createBuffer(`BUFFER_COLOR_${this.id}`);
    wgl.createBuffer(`BUFFER_INDICES_${this.id}`);

    // POPULATE BUFFER WITH COLOR (3 FLOATS, RGB)
    wgl.bindGpuArrayPointer(`BUFFER_COLOR_${this.id}`);
    wgl.populateGpuArrayPointer(
      new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0])
    );

    // POPULATE BUFFER WITH POSITION (2 FLOATS,XY)
    wgl.bindGpuArrayPointer(`BUFFER_POSITION_${this.id}`);
    wgl.populateGpuArrayPointer(
      new Float32Array([1.0, 1.0, -1.0, -1.0, 0.8, -0.6])
    );

    // POPULATE BUFFER WITH INDICES (3 UNSIGNED SHORTS)
    wgl.bindGpuIndexPointer(`BUFFER_INDICES_${this.id}`);
    wgl.populateGpuIndexPointer(new Uint16Array([0, 1, 2]));
  }
  dispose() {
    this.wgl.deleteBuffer(`BUFFER_POSITION_${this.id}`);
    this.wgl.deleteBuffer(`BUFFER_COLOR_${this.id}`);
    this.wgl.deleteBuffer(`BUFFER_INDICES_${this.id}`);
  }
  render() {
    const wgl = this.wgl;

    // -------- BIND SHADER TO BUFFERS --------

    // TELL WEBGL HOW TO READ COLOR DATA FROM THE BUFFER
    wgl.bindGpuArrayPointer(`BUFFER_COLOR_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_color", 3, 0, 0);

    // TELL WEBGL HOW TO READ THE DATA FROM THE BUFFER
    wgl.bindGpuArrayPointer(`BUFFER_POSITION_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_position", 2, 0, 0);

    // ENABLE BUFFER WITH INDICE AND DRAW
    wgl.bindGpuIndexPointer(`BUFFER_INDICES_${this.id}`);

    // DRAW
    wgl.drawUsingIndices(3);
  }
}

class App {
  constructor(canvas) {
    this.init(canvas);
  }

  async init(canvas) {
    const wgl = new Webgl(canvas);

    // GPU PROGRAM
    await wgl.loadFragmentShader("fragment-shader");
    await wgl.loadVertexShader("vertex-shader");
    wgl.compiledVertexShader();
    wgl.compiledFragmentShader();
    wgl.createGpuProgram();
    wgl.createAttributeVariable("a_position");
    wgl.createAttributeVariable("a_color");
    wgl.enableAttributeVariable("a_color");
    wgl.enableAttributeVariable("a_position");

    // OBJECT SETUP
    const t1 = new Triangle(wgl);
    const c1 = new Cube(wgl);
    const rect = new Rectangle(wgl);

    // DRAW SETUP
    wgl.clearFrameBuffer();
    // t1.render();
    // c1.render();
    rect.render();
  }
}
