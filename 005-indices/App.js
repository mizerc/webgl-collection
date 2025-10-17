const SIZE = 600;

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

    // SHADER VARIABLES
    wgl.createAttributeVariable("a_position");
    wgl.createAttributeVariable("a_color");
    wgl.enableAttributeVariable("a_color");
    wgl.enableAttributeVariable("a_position");

    // BUFFERS
    wgl.createBuffer("BUFFER_COLOR");
    wgl.createBuffer("BUFFER_POSITION");
    wgl.createBuffer("BUFFER_INDICES");
    wgl.createBuffer("BUFFER_INDICES_2");

    // POPULATE BUFFER WITH COLOR (3 FLOATS, RGB)
    wgl.bindGpuArrayPointer("BUFFER_COLOR");
    wgl.populateGpuArrayPointer(
      new Float32Array([
        1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      ])
    );

    // POPULATE BUFFER WITH POSITION (2 FLOATS,XY)
    wgl.bindGpuArrayPointer("BUFFER_POSITION");
    wgl.populateGpuArrayPointer(
      new Float32Array([1.0, 1.0, -1.0, -1.0, 0.8, -0.6, 0.8, 0])
    );

    // POPULATE BUFFER WITH INDICES (3 UNSIGNED SHORTS)
    wgl.bindGpuIndexPointer("BUFFER_INDICES");
    wgl.populateGpuIndexPointer("BUFFER_INDICES", new Uint16Array([0, 1, 2]));

    // POPULATE BUFFER WITH INDICES (3 UNSIGNED SHORTS)
    wgl.bindGpuIndexPointer("BUFFER_INDICES_2");
    wgl.populateGpuIndexPointer("BUFFER_INDICES_2", new Uint16Array([0, 1, 3]));

    // DRAW SETUP
    wgl.clearFrameBuffer();

    // TELL WEBGL HOW TO READ COLOR DATA FROM THE BUFFER
    wgl.bindGpuArrayPointer("BUFFER_COLOR");
    wgl.configureHowToParseCurrentGpuArrayPointer("a_color", 3, 0, 0);

    // TELL WEBGL HOW TO READ THE DATA FROM THE BUFFER
    wgl.bindGpuArrayPointer("BUFFER_POSITION");
    wgl.configureHowToParseCurrentGpuArrayPointer("a_position", 2, 0, 0);

    // ENABLE BUFFER WITH INDICE AND DRAW
    wgl.bindGpuIndexPointer("BUFFER_INDICES");
    wgl.drawUsingIndices(3);

    wgl.bindGpuIndexPointer("BUFFER_INDICES_2");
    wgl.drawUsingIndices(3);
  }
}
