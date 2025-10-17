const SIZE = 600;

class Triangle {
  constructor(wgl) {
    this.wgl = wgl;
    this.id = wgl.getUniqueId();
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
    t1.setup();

    // DRAW SETUP
    wgl.clearFrameBuffer();
    t1.render();
  }
}
