#version 300 es
// The nebula background, redrawn as dust.
//
// One draw call and no vertex buffers: every particle is a quad whose grid
// cell comes from gl_VertexID. Each one samples the nebula image under its
// cell for colour, and how bright that spot is decides how far forward the
// particle sits, so the lit cloud ridges move more than the dark gaps.
precision highp float;

uniform sampler2D uImage;
/** device pixels */
uniform vec2 uResolution;
/** columns, rows */
uniform vec2 uGrid;
/** image uv = screen uv * xy + zw, a cover fit */
uniform vec4 uCover;
/** mip level matching the particle spacing, so each particle averages its cell */
uniform float uLod;
/** pointer in screen uv, y down, smoothed */
uniform vec2 uPointer;
/** x: seconds, y: pointer presence 0..1, z: intro 0..1, w: device pixel ratio */
uniform vec4 uMisc;
/** overall brightness; the scene sits behind content */
uniform float uDim;
/** 0..1 as the cloud blows apart for good */
uniform float uDisperse;

out vec2 vLocal;
out vec3 vTint;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
/** the grid overshoots the screen so drifting edges never show a gap */
const float BLEED = 0.03;

const vec2 QUAD[6] = vec2[6](
  vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
  vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0)
);

float hash21 (vec2 p) {
  vec2 q = fract(p * vec2(0.1031, 0.1030));
  q += dot(q, q.yx + 33.33);
  return fract((q.x + q.y) * q.x);
}

float noise2 (vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main () {
  uint id = uint(gl_VertexID) / 6u;
  vec2 offset = QUAD[gl_VertexID % 6];
  uint cols = uint(uGrid.x);
  vec2 seed = vec2(float(id % cols), float(id / cols));
  float t = uMisc.x;
  float presence = uMisc.y;
  float pixelRatio = uMisc.w;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  float rnd = hash21(seed + 41.0);
  vec2 jitter = vec2(hash21(seed), hash21(seed + 17.0)) - 0.5;
  vec2 cell = (seed + 0.5 + jitter * 0.9) / uGrid;
  vec2 base = mix(vec2(-BLEED), vec2(1.0 + BLEED), cell);

  vec3 color = textureLod(uImage, base * uCover.xy + uCover.zw, uLod).rgb;
  float lum = dot(color, LUMA);
  float depth = smoothstep(0.10, 0.65, lum);

  // aspect-correct space, so noise and distances are round on any screen
  vec2 p = vec2(base.x * aspect, base.y);

  // a slow flow field the cloud swirls along, stronger on the lit ridges
  float angle = noise2(p * 2.2 + vec2(t * 0.030, -t * 0.020)) * 12.566;
  vec2 drift = vec2(cos(angle), sin(angle))
    * (0.0025 + 0.0075 * depth)
    * (0.65 + 0.35 * sin(t * 0.4 + rnd * 20.0));
  drift += vec2(
    sin(t * (0.30 + rnd * 0.50) + rnd * 40.0),
    cos(t * (0.25 + rnd * 0.40) + rnd * 23.0)
  ) * 0.0012;

  // luminous waves rolling through the cloud, plus a broad band that sweeps
  // across every twenty seconds
  float waveA = noise2(p * 1.3 + vec2(-t * 0.060, t * 0.025));
  float waveB = noise2(p * 3.1 + vec2(t * 0.040, t * 0.050));
  float wave = 0.65 + 0.55 * waveA + 0.25 * waveB;
  float sweep = fract(t * 0.05) * 1.8 - 0.4;
  float band = exp(-pow((base.x - sweep + (base.y - 0.5) * 0.25) * 5.0, 2.0));
  wave *= 1.0 + band * 0.45 * depth;

  // the pointer parts the dust around it and lifts its glow
  vec2 toPointer = vec2((base.x - uPointer.x) * aspect, base.y - uPointer.y);
  float near = (1.0 - smoothstep(0.0, 0.20, length(toPointer))) * presence;
  vec2 push = normalize(toPointer + vec2(0.0001, 0.0)) * near * near * (0.018 + 0.012 * rnd);
  // nearer dust slides further as the pointer moves, a hint of depth
  vec2 parallax = (uPointer - 0.5) * presence * depth * -0.012;

  // the cloud gathers in from a loose scatter on load, staggered per particle
  float settle = clamp((uMisc.z - rnd * 0.45) / 0.55, 0.0, 1.0);
  settle = settle * settle * (3.0 - 2.0 * settle);
  vec2 scatter = (vec2(hash21(seed + 5.0), hash21(seed + 9.0)) - 0.5) * 0.18 * (1.0 - settle);

  // the cloud blows outward and fades, each particle leaving on its own beat
  float leave = clamp((uDisperse - rnd * 0.35) / 0.65, 0.0, 1.0);
  leave *= leave;
  vec2 away = normalize(
    vec2((base.x - 0.5) * aspect, base.y - 0.5)
    + (vec2(hash21(seed + 5.0), hash21(seed + 9.0)) - 0.5) * 0.6
  );
  vec2 burst = away * leave * (0.4 + 0.8 * hash21(seed + 13.0));

  // sparse stars that twinkle on their own cycle
  float star = step(0.9965, hash21(seed + 63.0));
  float twinkle = pow(0.5 + 0.5 * sin(t * (0.8 + rnd * 2.0) + rnd * 50.0), 4.0);
  vec3 starTint = mix(color / max(max(color.r, max(color.g, color.b)), 0.05), vec3(1.0), 0.45);

  float shimmer = 0.85 + 0.15 * sin(t * (0.6 + rnd * 1.3) + rnd * 31.0);
  vec3 tint = color * (0.75 + 0.55 * depth) * wave * shimmer * (1.0 + near * 1.4);
  tint += starTint * star * (0.2 + 0.9 * twinkle);
  tint *= uDim * settle * (1.0 - leave);

  vec2 shift = drift + push + parallax + scatter + burst;
  vec2 screen = vec2(
    (base.x + shift.x / aspect) * 2.0 - 1.0,
    1.0 - (base.y + shift.y) * 2.0
  );
  float sizePx = (1.0 + depth * 0.5 + star * 0.8 + near * 0.5)
    * (0.8 + 0.4 * hash21(seed + 27.0))
    * (1.0 + leave * 1.5)
    * pixelRatio;

  gl_Position = vec4(screen + offset * sizePx * 2.0 / uResolution, 0.5, 1.0);
  vLocal = offset;
  vTint = tint;
}
