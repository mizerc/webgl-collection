precision mediump float;

// Color
varying lowp vec4 vColor;

// Texture
varying vec2 vTexCoord;
uniform sampler2D uSampler;

uniform bool uUseTexture;

void main(void) {
    // TEXTURE
    vec4 sampleFromTexture = texture2D(uSampler, vTexCoord);

    gl_FragColor = uUseTexture ? sampleFromTexture : vColor;
}