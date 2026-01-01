const SINGLE_BLUE_PIXEL = new Uint8Array([0, 0, 255, 255]); // RGBA
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
    this.textureBuffers = {};
    this.uniformVars = {};
  }
  getUniqueId() {
    if (!this._id) this._id = 0;
    return this._id++;
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
    console.log(`Compiling shader`);
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
    console.log(`Creating GPU program`);
    const gl = this.gl;
    const program = gl.createProgram();
    gl.attachShader(program, this.compiledVertexShader);
    gl.attachShader(program, this.compiledFragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    this.program = program;
  }
  createBuffer(bufferName) {
    console.log(`Creating buffer: ${bufferName}`);
    const gl = this.gl;
    this.bufferNames[bufferName] = gl.createBuffer();
  }
  bindGpuArrayPointer(bufferName) {
    console.log(`Updating gpu.target to point to buffer ${bufferName}`);
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNames[bufferName]);
  }
  populateGpuArrayPointer(vertexData) {
    console.log(`Populating target buffer with data.`);
    const gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  }
  bindGpuIndexPointer(bufferName) {
    const gl = this.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferNames[bufferName]);
  }
  populateGpuIndexPointer(indexData) {
    const gl = this.gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
  }
  createAttributeVariable(attributVarName) {
    console.log(`Grabbing shader variable location ${attributVarName}`);
    const gl = this.gl;
    this.attributeVars[attributVarName] = gl.getAttribLocation(
      this.program,
      attributVarName
    );
  }
  enableAttributeVariable(attributVarName) {
    console.log(`Enabling shader variable ${attributVarName}`);
    const gl = this.gl;
    gl.enableVertexAttribArray(this.attributeVars[attributVarName]);
  }
  disableAtributeVariable(attributVarName) {
    console.log(`Disabling shader variable ${attributVarName}`);
    const gl = this.gl;
    gl.disableVertexAttribArray(attributVarName);
  }
  // enableUniformVariable(uniformName) {
  //   const gl = this.gl;
  //   gl.enableVertexAttribArray(this.attributeVars[uniformName]);
  // }
  configureHowToParseCurrentGpuArrayPointer(
    attributVarName,
    NUMBER_OF_FLOATS,
    OFFSET_BYTES,
    STRIDE_BYTES
  ) {
    console.log(
      `Configuring GPU how to parse buffer to populate ${attributVarName}`
    );
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
  printDebug() {
    const gl = this.gl;
    const program = this.program;

    console.log(gl.getParameter(gl.CURRENT_PROGRAM));
    console.log(gl.getParameter(gl.VERTEX_ARRAY_BINDING));

    const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < count; ++i) {
      const info = gl.getActiveAttrib(program, i);
      const loc = gl.getAttribLocation(program, info.name);
      console.log(i, info.name, "→ location", loc);
    }

    const isEnabled = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
    const buffer = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
    console.log("Attrib 2 enabled:", isEnabled, "buffer:", buffer);
  }
  draw(NUMBER_OF_VERTEX) {
    const gl = this.gl;
    gl.drawArrays(gl.TRIANGLES, 0, NUMBER_OF_VERTEX);
  }
  drawUsingIndices(NUMBER_OF_INDICES, OFFSET = 0) {
    const gl = this.gl;
    gl.drawElements(gl.TRIANGLES, NUMBER_OF_INDICES, gl.UNSIGNED_SHORT, OFFSET);
  }
  async loadImage(imageSrc) {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });
    return image;
  }
  createTextureWithEmptyData() {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      SINGLE_BLUE_PIXEL
    );
  }
  createTextureBuffer(name) {
    const gl = this.gl;
    // CREATE TEXTURE BUFFER
    this.textureBuffers[name] = gl.createTexture();
  }
  bindTextureBuffer(name) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.textureBuffers[name]);
  }
  populateTextureFromUint8Array(uint8) {
    const gl = this.gl;
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      uint8
    );
  }
  populateTextureFromDomImage(domImage) {
    const gl = this.gl;

    // UPLOAD IMAGE DATA TO GPU
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      domImage
    );

    // SET PARAMS
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  }
  getUniformLocation(uniformName) {
    const gl = this.gl;
    this.uniformVars[uniformName] = gl.getUniformLocation(
      this.program,
      uniformName
    );
  }
  setUniformValue1i(uniformName, value) {
    const gl = this.gl;
    gl.uniform1i(this.uniformVars[uniformName], value);
  }
  activateAndBindTexture(textureBufferName) {
    const gl = this.gl;
    // SET TEXTURE_UNIT TO POINT TO TEXTURE_0
    gl.activeTexture(gl.TEXTURE0);
    // BIND BUFFER TO TEXTURE_UNIT (aka TEXTURE_0)
    gl.bindTexture(gl.TEXTURE_2D, this.textureBuffers[textureBufferName]);
  }
  bitmap() {
    // const blob = await fetch("texture.png").then(r => r.blob());
    // const bitmap = await createImageBitmap(blob, {
    // premultiplyAlpha: "none",
    // colorSpaceConversion: "none",
    // imageOrientation: "flipY"
    // });
    // We can't read RGBA pixel data directly from createImageBitmap
    // ctx.drawImage(bitmap, 0, 0);
    // const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  }
}
