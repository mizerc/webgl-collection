precision mediump float;

// From javascript to vertex shader
attribute vec4 a_position; // loc 0
attribute vec4 a_color;  // loc 1

// Texture
attribute vec2 aTexCoord;  // loc 2
varying vec2 vTexCoord;

// Color
varying lowp vec4 vColor;

void main(void) {
    gl_Position = a_position;
    vColor = a_color;
    vTexCoord = aTexCoord;
}