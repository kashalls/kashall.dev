#version 300 es
precision highp float;

in vec2 vLocal;
in vec3 vTint;
out vec4 fragColor;

void main () {
  float falloff = 1.0 - smoothstep(0.35, 1.0, length(vLocal));
  fragColor = vec4(vTint * falloff, 1.0);
}
