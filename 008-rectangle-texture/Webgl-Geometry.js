class Rectangle {
  constructor(wgl) {
    this.wgl = wgl;
    this.id = wgl.getUniqueId();
    this.setup();
  }
  static getVertexColors() {
    // 6 VERTEXES x 3 FLOATS (RGB)
    // prettier-ignore
    return
  }
  setup() {
    console.log(`---- RECT SETUP ----`);

    const wgl = this.wgl;

    // CREATE & POPULATE POSITION_BUFFER
    wgl.createBuffer(`RECT_POSITION_${this.id}`);
    wgl.bindGpuArrayPointer(`RECT_POSITION_${this.id}`);
    // prettier-ignore
    wgl.populateGpuArrayPointer(new Float32Array([
      // Triangle 1, 2 floats per vertex, X,Y
      -1, +1,
      +1, +1,
      -1, -1,
      // Triangle 2
       +1, +1, 
       +1, -1, 
       -1, -1,
    ]));

    // CREATE & POPULATE COLOR_BUFFER
    wgl.createBuffer(`RECT_COLOR_${this.id}`);
    wgl.bindGpuArrayPointer(`RECT_COLOR_${this.id}`);
    wgl.populateGpuArrayPointer(
      // prettier-ignore
      new Float32Array([
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
    );

    // SET UNIFORM TO DONT USER TEXTURE
    wgl.getUniformLocation("uUseTexture");
    wgl.setUniformValue1i("uUseTexture", 0);
  }
  async setupTexture() {
    console.log(`---- RECT TEXTURE SETUP ----`);
    const wgl = this.wgl;

    // ENABLE TEXTURE_SHADER_VARIABLES
    wgl.createAttributeVariable("aTexCoord");
    wgl.enableAttributeVariable("aTexCoord");

    // TEXTURTE_IMAGE_BUFFER
    wgl.createTextureBuffer("TEXTURE_IMAGE");
    wgl.bindTextureBuffer("TEXTURE_IMAGE");
    // const bluePixel = new Uint8Array([0, 0, 255, 255]);
    const domImage = await wgl.loadImage("./texture2.jpg");
    wgl.populateTextureFromDomImage(domImage);

    // POPULATE TEXTURE_UV_BUFFER
    wgl.createBuffer(`RECT_UV_COORD_${this.id}`);
    wgl.bindGpuArrayPointer(`RECT_UV_COORD_${this.id}`);
    const texCoords2 =
      // prettier-ignore
      new Float32Array([
        // Triangle 1
        0,0,
        1,0,
        0,1,
        // Triangle 2 
        1,0,
        1,1,
        0,1,
      ]);
    wgl.populateGpuArrayPointer(texCoords2);

    // SET TEXTURE SLOT USING UNIFORM
    wgl.getUniformLocation("uSampler");
    wgl.setUniformValue1i("uUseTexture", 0);

    // SET UNIFORM BOOL TO USE TEXTURE
    wgl.getUniformLocation("uUseTexture");
    wgl.setUniformValue1i("uUseTexture", 1);
  }

  render() {
    console.log(`---- RECT RENDER ----`);

    const wgl = this.wgl;

    wgl.bindGpuArrayPointer(`RECT_COLOR_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_color", 3, 0, 0);

    wgl.bindGpuArrayPointer(`RECT_POSITION_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_position", 2, 0, 0);

    // DRAW 6 VERTEXES
    wgl.draw(6);
  }
  renderWithTexture() {
    console.log(`---- RECT RENDER ----`);

    const wgl = this.wgl;

    // SET TEXTURE SLOT USING UNIFORM
    wgl.getUniformLocation("uSampler");
    wgl.setUniformValue1i("uUseTexture", 1);

    wgl.setUniformValue1i("uSample", 0);
    wgl.activateAndBindTexture("TEXTURE_IMAGE");

    wgl.bindGpuArrayPointer(`RECT_COLOR_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_color", 3, 0, 0);

    wgl.bindGpuArrayPointer(`RECT_POSITION_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("a_position", 2, 0, 0);

    wgl.bindGpuArrayPointer(`RECT_UV_COORD_${this.id}`);
    wgl.configureHowToParseCurrentGpuArrayPointer("aTexCoord", 2, 0, 0);

    // DRAW 6 VERTEXES
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
    console.log(`---- CUBE SETUP ----`);

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
      0, 1, 2,  0, 2, 3,   // front (2 triangles, 6 vertex)
      4, 5, 6,  4, 6, 7,   // back
      3, 2, 6,  3, 6, 5,   // top
      0, 7, 1,  0, 4, 7,   // bottom
      1, 7, 6,  1, 6, 2,   // right
      0, 3, 5,  0, 5, 4    // left
    ])
    );
  }

  render() {
    console.log(`---- CUBE RENDER ----`);

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
    console.log(`---- TRI SETUP ----`);

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
    console.log(`---- TRI RENDER ----`);
    
    const wgl = this.wgl;

    // SET UNIFORM BOOL TO DISABLE TEXTURE
    wgl.getUniformLocation("uUseTexture");
    wgl.setUniformValue1i("uUseTexture", 0);

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
