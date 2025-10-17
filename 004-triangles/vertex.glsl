precision mediump float;

attribute vec4 a_position;
attribute vec4 a_color;

varying lowp vec4 vColor;

void main(void) {
    gl_Position = a_position;
    vColor = a_color;
}