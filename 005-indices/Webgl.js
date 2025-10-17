class Webgl {
  constructor(canvas) {
    this.canvas = canvas;
    canvas.width = SIZE;
    canvas.height = SIZE;
    canvas.style.display = "block";
    canvas.style.border = "1px solid #ff0000ff";
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported in this browser.");
    }
    this.gl = gl;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    Webgl.printGpuSpecs(this.gl);
    this.bufferNames = {};
    this.attributeVars = {};
  }
  static printGpuSpecs(gl) {
    console.log("Max attributes:", gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
    console.log(
      "Max vertex uniforms:",
      gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
    );
    console.log(
      "Max fragment uniforms:",
      gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)
    );
  }
  async loadVertexShader(id) {
    this.loadedVertexShader = await Webgl.loadShaderFromScriptTag(id);
  }
  async loadFragmentShader(id) {
    this.loadedFragmentShader = await Webgl.loadShaderFromScriptTag(id);
  }
  compiledVertexShader() {
    this.compiledVertexShader = Webgl.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      this.loadedVertexShader
    );
  }
  compiledFragmentShader() {
    this.compiledFragmentShader = Webgl.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      this.loadedFragmentShader
    );
  }
  static async loadShaderFromScriptTag(id) {
    const script = document.getElementById(id);
    const src = script.getAttribute("src");
    if (!src) throw new Error(`Shader script ${id} missing src`);
    const response = await fetch(src);
    return await response.text();
  }
  static compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      throw new Error("Shader compile failed");
    }
    return shader;
  }
  createGpuProgram() {
    const gl = this.gl;
    const program = gl.createProgram();
    gl.attachShader(program, this.compiledVertexShader);
    gl.attachShader(program, this.compiledFragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    this.program = program;
  }
  createBuffer(bufferName) {
    const gl = this.gl;
    this.bufferNames[bufferName] = gl.createBuffer();
  }
  bindGpuArrayPointer(bufferName) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNames[bufferName]);
  }
  populateGpuArrayPointer( vertexData) {
    const gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  }
  bindGpuIndexPointer(bufferName) {
    const gl = this.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferNames[bufferName]);
  }
  populateGpuIndexPointer(bufferName, indexData) {
    const gl = this.gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
  }
  createAttributeVariable(attributVarName) {
    const gl = this.gl;
    this.attributeVars[attributVarName] = gl.getAttribLocation(
      this.program,
      attributVarName
    );
  }
  enableAttributeVariable(attributVarName) {
    const gl = this.gl;
    gl.enableVertexAttribArray(this.attributeVars[attributVarName]);
  }
  configureHowToParseCurrentGpuArrayPointer(
    attributVarName,
    NUMBER_OF_FLOATS,
    OFFSET_BYTES,
    STRIDE_BYTES
  ) {
    const gl = this.gl;
    gl.vertexAttribPointer(
      this.attributeVars[attributVarName],
      NUMBER_OF_FLOATS,
      gl.FLOAT,
      false,
      STRIDE_BYTES,
      OFFSET_BYTES
    );
  }
  clearFrameBuffer() {
    const gl = this.gl;
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  draw(NUMBER_OF_VERTEX) {
    const gl = this.gl;
    gl.drawArrays(gl.TRIANGLES, 0, NUMBER_OF_VERTEX);
  }
  drawUsingIndices(NUMBER_OF_INDICES, OFFSET = 0) {
    const gl = this.gl;
    gl.drawElements(gl.TRIANGLES, NUMBER_OF_INDICES, gl.UNSIGNED_SHORT, OFFSET);
  }
}
