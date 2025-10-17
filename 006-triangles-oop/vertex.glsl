precision mediump float;

// From javascript to vertex shader
attribute vec4 a_position;
attribute vec4 a_color;

// From vertex shader to fragment shader
varying lowp vec4 vColor;

void main(void) {
    gl_Position = a_position;
    vColor = a_color;
}