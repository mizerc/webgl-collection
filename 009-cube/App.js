const SIZE = 600;

class App {
  constructor(canvas) {
    this.init(canvas);
  }

  async init(canvas) {
    const wgl = new Webgl(canvas);

    console.log(`---- APP SETUP ----`);

    // GPU PROGRAM
    await wgl.loadFragmentShader("fragment-shader");
    await wgl.loadVertexShader("vertex-shader");
    wgl.compiledVertexShader();
    wgl.compiledFragmentShader();
    wgl.createGpuProgram();

    // POSITION SHADER_VARIABLES
    wgl.createAttributeVariable("a_position");
    wgl.enableAttributeVariable("a_position");

    // COLOR SHADER_VARIABLES
    wgl.createAttributeVariable("a_color");
    wgl.enableAttributeVariable("a_color");

    // SETUP OBJECTS
    const rect = new Rectangle(wgl);
    await rect.setupTexture();
    const tri = new Triangle(wgl);

    // RENDER
    wgl.clearFrameBuffer();
    rect.renderWithTexture();
    tri.render();
  }
}
