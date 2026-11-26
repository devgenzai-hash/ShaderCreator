import { ShaderNodeType, ShaderNodeData, ShaderUniform } from '../store/shaderStore'
import { type Node, type Edge } from '@xyflow/react'

export interface NodeTemplate {
  type: ShaderNodeType
  label: string
  category: string
  description: string
  uniforms: ShaderUniform[]
  code: string
  inputs: string[]
  outputs: string[]
  color: string
}

export const nodeTemplates: NodeTemplate[] = [
  // Input Nodes
  {
    type: 'uv',
    label: 'UV Coordinates',
    category: 'Input',
    description: 'Base UV coordinates for texture mapping',
    uniforms: [],
    code: 'vec2 uv = vUv;',
    inputs: [],
    outputs: ['uv'],
    color: '#4a9eff',
  },
  {
    type: 'time',
    label: 'Time',
    category: 'Input',
    description: 'Animated time value for animations',
    uniforms: [
      { name: 'speed', type: 'float', value: 1.0, min: 0, max: 10, step: 0.1 },
    ],
    code: 'float time = u_time * {{speed}};',
    inputs: [],
    outputs: ['time'],
    color: '#4a9eff',
  },
  {
    type: 'mouse',
    label: 'Mouse Position',
    category: 'Input',
    description: 'Track mouse position for interactive effects',
    uniforms: [
      { name: 'smoothing', type: 'float', value: 0.1, min: 0, max: 1, step: 0.01 },
      { name: 'influence', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
    ],
    code: 'vec2 mouse = u_mouse * {{influence}};',
    inputs: [],
    outputs: ['position'],
    color: '#4a9eff',
  },
  {
    type: 'click',
    label: 'Click Event',
    category: 'Input',
    description: 'React to mouse clicks with ripple/pulse effects',
    uniforms: [
      { name: 'radius', type: 'float', value: 0.5, min: 0, max: 2, step: 0.01 },
      { name: 'decay', type: 'float', value: 2.0, min: 0.1, max: 10, step: 0.1 },
      { name: 'intensity', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
    ],
    code: 'float click = smoothstep({{radius}}, 0.0, length(vUv - u_click)) * u_clickTime * {{intensity}};',
    inputs: [],
    outputs: ['value'],
    color: '#4a9eff',
  },
  {
    type: 'scroll',
    label: 'Scroll Position',
    category: 'Input',
    description: 'Use scroll position to drive shader effects',
    uniforms: [
      { name: 'multiplier', type: 'float', value: 1.0, min: 0, max: 10, step: 0.1 },
    ],
    code: 'float scroll = u_scroll * {{multiplier}};',
    inputs: [],
    outputs: ['value'],
    color: '#4a9eff',
  },

  // Color Nodes
  {
    type: 'color',
    label: 'Solid Color',
    category: 'Color',
    description: 'A solid color value',
    uniforms: [
      { name: 'color', type: 'vec3', value: [1.0, 0.0, 0.5] },
    ],
    code: 'vec3 solidColor = vec3({{color}});',
    inputs: [],
    outputs: ['color'],
    color: '#ff6b6b',
  },
  {
    type: 'gradient',
    label: 'Gradient',
    category: 'Color',
    description: 'Linear or radial gradient between colors',
    uniforms: [
      { name: 'colorA', type: 'vec3', value: [1.0, 0.0, 0.0] },
      { name: 'colorB', type: 'vec3', value: [0.0, 0.0, 1.0] },
      { name: 'angle', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
      { name: 'type', type: 'int', value: 0 },
    ],
    code: `vec2 gradUv = vUv;
float gradT = gradUv.x * cos({{angle}}) + gradUv.y * sin({{angle}});
vec3 gradient = mix(vec3({{colorA}}), vec3({{colorB}}), gradT);`,
    inputs: ['uv'],
    outputs: ['color'],
    color: '#ff6b6b',
  },

  // Math Nodes
  {
    type: 'math',
    label: 'Math Operation',
    category: 'Math',
    description: 'Perform math operations (add, multiply, sin, cos, etc.)',
    uniforms: [
      { name: 'operation', type: 'int', value: 0 },
      { name: 'valueA', type: 'float', value: 1.0, min: -10, max: 10, step: 0.01 },
      { name: 'valueB', type: 'float', value: 1.0, min: -10, max: 10, step: 0.01 },
    ],
    code: 'float result = {{valueA}} * {{valueB}};',
    inputs: ['a', 'b'],
    outputs: ['result'],
    color: '#feca57',
  },
  {
    type: 'mix',
    label: 'Mix/Blend',
    category: 'Math',
    description: 'Blend between two values using a factor',
    uniforms: [
      { name: 'factor', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'blendMode', type: 'int', value: 0 },
    ],
    code: 'vec3 mixed = mix(inputA, inputB, {{factor}});',
    inputs: ['a', 'b', 'factor'],
    outputs: ['result'],
    color: '#feca57',
  },

  // Noise Nodes
  {
    type: 'noise',
    label: 'Noise Generator',
    category: 'Noise',
    description: 'Generate procedural noise (Perlin, Simplex, Worley, FBM)',
    uniforms: [
      { name: 'scale', type: 'float', value: 5.0, min: 0.1, max: 50, step: 0.1 },
      { name: 'octaves', type: 'int', value: 4 },
      { name: 'persistence', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'lacunarity', type: 'float', value: 2.0, min: 1, max: 4, step: 0.1 },
      { name: 'speed', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
      { name: 'noiseType', type: 'int', value: 0 },
    ],
    code: `float noise = fbm(vUv * {{scale}} + u_time * {{speed}}, {{octaves}}, {{persistence}}, {{lacunarity}});`,
    inputs: ['uv', 'time'],
    outputs: ['value'],
    color: '#1dd1a1',
  },
  {
    type: 'pattern',
    label: 'Pattern',
    category: 'Noise',
    description: 'Generate geometric patterns (stripes, dots, checkers, waves)',
    uniforms: [
      { name: 'scale', type: 'float', value: 10.0, min: 1, max: 100, step: 1 },
      { name: 'patternType', type: 'int', value: 0 },
      { name: 'thickness', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'rotation', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
    ],
    code: `float pattern = step({{thickness}}, fract(vUv.x * {{scale}}));`,
    inputs: ['uv'],
    outputs: ['value'],
    color: '#1dd1a1',
  },

  // Texture Nodes
  {
    type: 'texture',
    label: 'Texture Sample',
    category: 'Texture',
    description: 'Sample from an uploaded texture/image',
    uniforms: [
      { name: 'textureId', type: 'int', value: 0 },
      { name: 'tiling', type: 'vec2', value: [1.0, 1.0] },
      { name: 'offset', type: 'vec2', value: [0.0, 0.0] },
    ],
    code: 'vec4 texColor = texture2D(u_texture0, vUv * vec2({{tiling}}) + vec2({{offset}}));',
    inputs: ['uv'],
    outputs: ['color', 'r', 'g', 'b', 'a'],
    color: '#48dbfb',
  },
  {
    type: 'image',
    label: 'Image Input',
    category: 'Texture',
    description: 'Upload and use an image as shader input',
    uniforms: [
      { name: 'textureId', type: 'int', value: 0 },
      { name: 'fit', type: 'int', value: 0 },
    ],
    code: 'vec4 imgColor = texture2D(u_image0, vUv);',
    inputs: [],
    outputs: ['color', 'r', 'g', 'b', 'a'],
    color: '#48dbfb',
  },
  {
    type: 'video',
    label: 'Video Input',
    category: 'Texture',
    description: 'Use video as dynamic shader texture',
    uniforms: [
      { name: 'textureId', type: 'int', value: 0 },
      { name: 'playbackSpeed', type: 'float', value: 1.0, min: 0.1, max: 4, step: 0.1 },
      { name: 'loop', type: 'bool', value: 1 },
    ],
    code: 'vec4 videoColor = texture2D(u_video0, vUv);',
    inputs: [],
    outputs: ['color', 'r', 'g', 'b', 'a'],
    color: '#48dbfb',
  },

  // Lighting Nodes
  {
    type: 'light',
    label: 'Point Light',
    category: 'Lighting',
    description: 'Add point light with position, color, and intensity',
    uniforms: [
      { name: 'position', type: 'vec3', value: [1.0, 1.0, 2.0] },
      { name: 'color', type: 'vec3', value: [1.0, 1.0, 1.0] },
      { name: 'intensity', type: 'float', value: 1.0, min: 0, max: 10, step: 0.1 },
      { name: 'falloff', type: 'float', value: 2.0, min: 0.1, max: 10, step: 0.1 },
    ],
    code: `vec3 lightDir = normalize(vec3({{position}}) - vPosition);
float diff = max(dot(vNormal, lightDir), 0.0);
float dist = length(vec3({{position}}) - vPosition);
float attenuation = {{intensity}} / (1.0 + {{falloff}} * dist * dist);
vec3 lighting = vec3({{color}}) * diff * attenuation;`,
    inputs: ['normal', 'position'],
    outputs: ['color', 'intensity'],
    color: '#ff9ff3',
  },
  {
    type: 'fresnel',
    label: 'Fresnel Effect',
    category: 'Lighting',
    description: 'Edge glow/rim lighting effect',
    uniforms: [
      { name: 'power', type: 'float', value: 2.0, min: 0.1, max: 10, step: 0.1 },
      { name: 'color', type: 'vec3', value: [0.3, 0.6, 1.0] },
      { name: 'intensity', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
    ],
    code: `float fresnelTerm = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), {{power}});
vec3 fresnelColor = vec3({{color}}) * fresnelTerm * {{intensity}};`,
    inputs: ['normal'],
    outputs: ['color', 'value'],
    color: '#ff9ff3',
  },
  {
    type: 'normal',
    label: 'Normal Map',
    category: 'Lighting',
    description: 'Apply normal mapping for surface detail',
    uniforms: [
      { name: 'strength', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
    ],
    code: 'vec3 normalMap = normalize(vNormal * {{strength}});',
    inputs: ['texture'],
    outputs: ['normal'],
    color: '#ff9ff3',
  },

  // Effects Nodes
  {
    type: 'particles',
    label: 'Particles',
    category: 'Effects',
    description: 'Procedural particle system',
    uniforms: [
      { name: 'count', type: 'float', value: 50.0, min: 1, max: 200, step: 1 },
      { name: 'size', type: 'float', value: 0.02, min: 0.001, max: 0.2, step: 0.001 },
      { name: 'speed', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
      { name: 'color', type: 'vec3', value: [1.0, 0.8, 0.2] },
      { name: 'spread', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
      { name: 'gravity', type: 'float', value: 0.0, min: -2, max: 2, step: 0.1 },
    ],
    code: `float particles = 0.0;
for(float i = 0.0; i < {{count}}; i++) {
  vec2 pos = vec2(
    fract(sin(i * 12.9898) * 43758.5453) * {{spread}},
    fract(cos(i * 78.233) * 43758.5453 + u_time * {{speed}} * (0.5 + fract(sin(i * 45.164) * 43758.5453) * 0.5)) - {{gravity}} * u_time * 0.1
  );
  pos = fract(pos);
  float d = length(vUv - pos);
  particles += smoothstep({{size}}, 0.0, d);
}
vec3 particleColor = vec3({{color}}) * particles;`,
    inputs: ['uv', 'time'],
    outputs: ['color', 'value'],
    color: '#c44569',
  },
  {
    type: 'distortion',
    label: 'Distortion',
    category: 'Effects',
    description: 'Distort UVs using noise or displacement',
    uniforms: [
      { name: 'strength', type: 'float', value: 0.1, min: 0, max: 1, step: 0.01 },
      { name: 'frequency', type: 'float', value: 5.0, min: 0.1, max: 20, step: 0.1 },
      { name: 'speed', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
      { name: 'type', type: 'int', value: 0 },
    ],
    code: `vec2 distortedUv = vUv + vec2(
  sin(vUv.y * {{frequency}} + u_time * {{speed}}) * {{strength}},
  cos(vUv.x * {{frequency}} + u_time * {{speed}}) * {{strength}}
);`,
    inputs: ['uv', 'time'],
    outputs: ['uv'],
    color: '#c44569',
  },
  {
    type: 'blur',
    label: 'Blur',
    category: 'Effects',
    description: 'Apply gaussian or radial blur',
    uniforms: [
      { name: 'radius', type: 'float', value: 2.0, min: 0, max: 10, step: 0.1 },
      { name: 'quality', type: 'int', value: 4 },
      { name: 'type', type: 'int', value: 0 },
    ],
    code: `vec4 blurred = vec4(0.0);
float total = 0.0;
for(int x = -{{quality}}; x <= {{quality}}; x++) {
  for(int y = -{{quality}}; y <= {{quality}}; y++) {
    vec2 offset = vec2(float(x), float(y)) * {{radius}} / u_resolution;
    blurred += texture2D(u_texture0, vUv + offset);
    total += 1.0;
  }
}
blurred /= total;`,
    inputs: ['texture', 'uv'],
    outputs: ['color'],
    color: '#c44569',
  },
  {
    type: 'glow',
    label: 'Glow/Bloom',
    category: 'Effects',
    description: 'Add glow/bloom effect',
    uniforms: [
      { name: 'threshold', type: 'float', value: 0.6, min: 0, max: 1, step: 0.01 },
      { name: 'intensity', type: 'float', value: 1.5, min: 0, max: 5, step: 0.1 },
      { name: 'radius', type: 'float', value: 3.0, min: 0, max: 10, step: 0.1 },
      { name: 'color', type: 'vec3', value: [1.0, 0.8, 0.4] },
    ],
    code: `float brightness = dot(inputColor, vec3(0.2126, 0.7152, 0.0722));
vec3 glow = inputColor * smoothstep({{threshold}}, 1.0, brightness) * {{intensity}};
glow *= vec3({{color}});`,
    inputs: ['color'],
    outputs: ['color'],
    color: '#c44569',
  },

  // Output Node
  {
    type: 'output',
    label: 'Shader Output',
    category: 'Output',
    description: 'Final shader output (connect color here)',
    uniforms: [
      { name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 },
    ],
    code: 'gl_FragColor = vec4(finalColor, {{alpha}});',
    inputs: ['color', 'alpha'],
    outputs: [],
    color: '#ff4757',
  },

  // ============================
  // NEW INPUT NODES
  // ============================
  {
    type: 'position',
    label: 'Position',
    category: 'Input',
    description: '3D world/local position of the fragment',
    uniforms: [
      { name: 'space', type: 'int', value: 0 },
    ],
    code: 'vec3 position = vPosition;',
    inputs: [],
    outputs: ['position', 'x', 'y', 'z'],
    color: '#4a9eff',
  },
  {
    type: 'uniform',
    label: 'Custom Uniform',
    category: 'Input',
    description: 'Define your own custom uniform input value',
    uniforms: [
      { name: 'value', type: 'float', value: 1.0, min: -100, max: 100, step: 0.01 },
      { name: 'name', type: 'int', value: 0 },
    ],
    code: 'float customUniform = {{value}};',
    inputs: [],
    outputs: ['value'],
    color: '#4a9eff',
  },
  {
    type: 'resolution',
    label: 'Resolution',
    category: 'Input',
    description: 'Screen resolution in pixels and aspect ratio',
    uniforms: [],
    code: `vec2 resolution = u_resolution;\nfloat aspect = u_resolution.x / u_resolution.y;`,
    inputs: [],
    outputs: ['resolution', 'aspect'],
    color: '#4a9eff',
  },

  // ============================
  // NEW PROCESSING NODES
  // ============================
  {
    type: 'trigonometry',
    label: 'Trigonometry',
    category: 'Math',
    description: 'sin, cos, tan, asin, acos, atan and more',
    uniforms: [
      { name: 'function', type: 'int', value: 0 },
      { name: 'input', type: 'float', value: 0.0, min: -6.28, max: 6.28, step: 0.01 },
      { name: 'frequency', type: 'float', value: 1.0, min: 0.1, max: 20, step: 0.1 },
      { name: 'amplitude', type: 'float', value: 1.0, min: 0, max: 10, step: 0.1 },
      { name: 'offset', type: 'float', value: 0.0, min: -5, max: 5, step: 0.01 },
    ],
    code: 'float trig = sin({{input}} * {{frequency}} + u_time) * {{amplitude}} + {{offset}};',
    inputs: ['value'],
    outputs: ['result'],
    color: '#feca57',
  },
  {
    type: 'vectorOps',
    label: 'Vector Operations',
    category: 'Math',
    description: 'dot, cross, normalize, length, distance, reflect',
    uniforms: [
      { name: 'operation', type: 'int', value: 0 },
      { name: 'vecA', type: 'vec3', value: [1.0, 0.0, 0.0] },
      { name: 'vecB', type: 'vec3', value: [0.0, 1.0, 0.0] },
    ],
    code: `float dotProduct = dot(vec3({{vecA}}), vec3({{vecB}}));\nvec3 crossProduct = cross(vec3({{vecA}}), vec3({{vecB}}));\nfloat vecLength = length(vec3({{vecA}}));`,
    inputs: ['a', 'b'],
    outputs: ['scalar', 'vector'],
    color: '#feca57',
  },
  {
    type: 'logicBranch',
    label: 'Logic / Branch',
    category: 'Math',
    description: 'if/else branching, comparisons, step, smoothstep',
    uniforms: [
      { name: 'mode', type: 'int', value: 0 },
      { name: 'threshold', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'smoothness', type: 'float', value: 0.1, min: 0, max: 1, step: 0.01 },
    ],
    code: `float branchResult = smoothstep({{threshold}} - {{smoothness}}, {{threshold}} + {{smoothness}}, inputValue);`,
    inputs: ['value', 'threshold'],
    outputs: ['result'],
    color: '#feca57',
  },
  {
    type: 'filter',
    label: 'Filter',
    category: 'Math',
    description: 'Edge detect, sharpen, emboss, sobel operator',
    uniforms: [
      { name: 'type', type: 'int', value: 0 },
      { name: 'strength', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
      { name: 'radius', type: 'float', value: 1.0, min: 0.1, max: 10, step: 0.1 },
    ],
    code: `vec2 texelSize = 1.0 / u_resolution;\nfloat kernel = 0.0;\nfor(int x = -1; x <= 1; x++) {\n  for(int y = -1; y <= 1; y++) {\n    vec2 sampleUv = vUv + vec2(float(x), float(y)) * texelSize * {{radius}};\n    float s = length(texture2D(u_texture0, sampleUv).rgb);\n    kernel += s * (x == 0 && y == 0 ? -8.0 : 1.0);\n  }\n}\nfloat filtered = kernel * {{strength}};`,
    inputs: ['texture', 'uv'],
    outputs: ['value', 'color'],
    color: '#feca57',
  },
  {
    type: 'step',
    label: 'Step / Smoothstep',
    category: 'Math',
    description: 'Hard or smooth threshold cutoff on a value',
    uniforms: [
      { name: 'edge1', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
      { name: 'edge2', type: 'float', value: 0.7, min: 0, max: 1, step: 0.01 },
      { name: 'smooth', type: 'int', value: 1 },
    ],
    code: `float stepped = smoothstep({{edge1}}, {{edge2}}, inputValue);`,
    inputs: ['value'],
    outputs: ['result'],
    color: '#feca57',
  },
  {
    type: 'clamp',
    label: 'Clamp / Saturate',
    category: 'Math',
    description: 'Clamp value between min and max bounds',
    uniforms: [
      { name: 'minVal', type: 'float', value: 0.0, min: -10, max: 10, step: 0.01 },
      { name: 'maxVal', type: 'float', value: 1.0, min: -10, max: 10, step: 0.01 },
    ],
    code: `float clamped = clamp(inputValue, {{minVal}}, {{maxVal}});`,
    inputs: ['value'],
    outputs: ['result'],
    color: '#feca57',
  },
  {
    type: 'remap',
    label: 'Remap Range',
    category: 'Math',
    description: 'Remap a value from one range to another',
    uniforms: [
      { name: 'inMin', type: 'float', value: 0.0, min: -10, max: 10, step: 0.01 },
      { name: 'inMax', type: 'float', value: 1.0, min: -10, max: 10, step: 0.01 },
      { name: 'outMin', type: 'float', value: 0.0, min: -10, max: 10, step: 0.01 },
      { name: 'outMax', type: 'float', value: 1.0, min: -10, max: 10, step: 0.01 },
    ],
    code: `float remapped = {{outMin}} + (inputValue - {{inMin}}) / ({{inMax}} - {{inMin}}) * ({{outMax}} - {{outMin}});`,
    inputs: ['value'],
    outputs: ['result'],
    color: '#feca57',
  },

  // ============================
  // NEW COLOR & LIGHTING NODES
  // ============================
  {
    type: 'colorBlend',
    label: 'Color Blend',
    category: 'Color',
    description: 'Advanced blend modes: overlay, screen, multiply, dodge, burn, difference, etc.',
    uniforms: [
      { name: 'blendMode', type: 'int', value: 0 },
      { name: 'opacity', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 },
    ],
    code: `// Blend modes: 0=multiply, 1=screen, 2=overlay, 3=dodge, 4=burn, 5=difference, 6=exclusion
vec3 blendMultiply = baseColor * blendColor;
vec3 blendScreen = 1.0 - (1.0 - baseColor) * (1.0 - blendColor);
vec3 blendOverlay = mix(2.0 * baseColor * blendColor, 1.0 - 2.0 * (1.0 - baseColor) * (1.0 - blendColor), step(0.5, baseColor));
vec3 blended = mix(baseColor, blendMultiply, {{opacity}});`,
    inputs: ['base', 'blend', 'opacity'],
    outputs: ['color'],
    color: '#ff6b6b',
  },
  {
    type: 'colorCorrect',
    label: 'Color Correction',
    category: 'Color',
    description: 'Brightness, contrast, saturation, hue shift, gamma, exposure',
    uniforms: [
      { name: 'brightness', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
      { name: 'contrast', type: 'float', value: 1.0, min: 0, max: 3, step: 0.01 },
      { name: 'saturation', type: 'float', value: 1.0, min: 0, max: 3, step: 0.01 },
      { name: 'hueShift', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
      { name: 'gamma', type: 'float', value: 1.0, min: 0.1, max: 3, step: 0.01 },
      { name: 'exposure', type: 'float', value: 0.0, min: -3, max: 3, step: 0.1 },
    ],
    code: `vec3 corrected = inputColor;\ncorrected = corrected + {{brightness}};\ncorrected = (corrected - 0.5) * {{contrast}} + 0.5;\nfloat luma = dot(corrected, vec3(0.2126, 0.7152, 0.0722));\ncorrected = mix(vec3(luma), corrected, {{saturation}});\ncorrected = pow(corrected, vec3(1.0 / {{gamma}}));\ncorrected *= exp2({{exposure}});`,
    inputs: ['color'],
    outputs: ['color'],
    color: '#ff6b6b',
  },
  {
    type: 'pbrLighting',
    label: 'PBR Lighting',
    category: 'Lighting',
    description: 'Physically-based rendering with metallic, roughness, ambient, specular',
    uniforms: [
      { name: 'lightPos', type: 'vec3', value: [2.0, 2.0, 3.0] },
      { name: 'lightColor', type: 'vec3', value: [1.0, 0.95, 0.9] },
      { name: 'metallic', type: 'float', value: 0.0, min: 0, max: 1, step: 0.01 },
      { name: 'roughness', type: 'float', value: 0.5, min: 0.01, max: 1, step: 0.01 },
      { name: 'ambientStrength', type: 'float', value: 0.1, min: 0, max: 1, step: 0.01 },
      { name: 'albedo', type: 'vec3', value: [0.8, 0.2, 0.2] },
    ],
    code: `// PBR Lighting (Cook-Torrance BRDF)
vec3 N = normalize(vNormal);
vec3 V = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
vec3 L = normalize(vec3({{lightPos}}) - vPosition);
vec3 H = normalize(V + L);
float NdotL = max(dot(N, L), 0.0);
float NdotH = max(dot(N, H), 0.0);
float NdotV = max(dot(N, V), 0.0);
float roughSq = {{roughness}} * {{roughness}};
float D = roughSq / (3.14159 * pow(NdotH * NdotH * (roughSq - 1.0) + 1.0, 2.0));
float G = NdotL * NdotV / max(mix(NdotL, 1.0, roughSq * 0.5) * mix(NdotV, 1.0, roughSq * 0.5), 0.001);
vec3 F0 = mix(vec3(0.04), vec3({{albedo}}), {{metallic}});
vec3 F = F0 + (1.0 - F0) * pow(1.0 - max(dot(H, V), 0.0), 5.0);
vec3 specular = (D * G * F) / max(4.0 * NdotL * NdotV, 0.001);
vec3 kD = (1.0 - F) * (1.0 - {{metallic}});
vec3 pbrColor = (kD * vec3({{albedo}}) / 3.14159 + specular) * vec3({{lightColor}}) * NdotL;
pbrColor += vec3({{albedo}}) * {{ambientStrength}};`,
    inputs: ['normal', 'albedo', 'metallic', 'roughness'],
    outputs: ['color', 'specular', 'diffuse'],
    color: '#ff9ff3',
  },
  {
    type: 'ambientOcclusion',
    label: 'Ambient Occlusion',
    category: 'Lighting',
    description: 'Fake AO based on screen-space or procedural methods',
    uniforms: [
      { name: 'intensity', type: 'float', value: 1.0, min: 0, max: 3, step: 0.1 },
      { name: 'radius', type: 'float', value: 0.5, min: 0.01, max: 2, step: 0.01 },
      { name: 'samples', type: 'int', value: 8 },
    ],
    code: `float ao = 1.0;\nfor(int i = 0; i < 8; i++) {\n  float angle = float(i) * 0.785;\n  vec2 sampleOffset = vec2(cos(angle), sin(angle)) * {{radius}} * (1.0 / u_resolution.x);\n  float sampleDepth = length(texture2D(u_texture0, vUv + sampleOffset).rgb);\n  ao -= (1.0 / 8.0) * smoothstep(0.0, 1.0, sampleDepth) * {{intensity}};\n}\nao = clamp(ao, 0.0, 1.0);`,
    inputs: ['texture', 'uv'],
    outputs: ['value'],
    color: '#ff9ff3',
  },
  {
    type: 'shadow',
    label: 'Shadow',
    category: 'Lighting',
    description: 'Drop shadow or soft shadow projection',
    uniforms: [
      { name: 'offset', type: 'vec2', value: [0.02, -0.02] },
      { name: 'softness', type: 'float', value: 0.01, min: 0, max: 0.1, step: 0.001 },
      { name: 'opacity', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'color', type: 'vec3', value: [0.0, 0.0, 0.0] },
    ],
    code: `vec2 shadowUv = vUv + vec2({{offset}});\nfloat shadowMask = smoothstep(0.0, {{softness}}, length(vUv - shadowUv));\nvec3 shadowColor = vec3({{color}}) * {{opacity}} * (1.0 - shadowMask);`,
    inputs: ['uv', 'shape'],
    outputs: ['color', 'mask'],
    color: '#ff9ff3',
  },

  // ============================
  // NEW GEOMETRY / 3D NODES
  // ============================
  {
    type: 'geometry',
    label: 'Geometry',
    category: '3D',
    description: 'Access geometric properties: normals, tangents, bitangents, face direction',
    uniforms: [
      { name: 'property', type: 'int', value: 0 },
    ],
    code: `vec3 geoNormal = normalize(vNormal);\nvec3 geoTangent = normalize(cross(geoNormal, vec3(0.0, 1.0, 0.0)));\nvec3 geoBitangent = normalize(cross(geoNormal, geoTangent));\nfloat facing = dot(geoNormal, vec3(0.0, 0.0, 1.0));`,
    inputs: [],
    outputs: ['normal', 'tangent', 'bitangent', 'facing'],
    color: '#a29bfe',
  },
  {
    type: 'glbModel',
    label: '3D Model (GLB)',
    category: '3D',
    description: 'Load a GLB/GLTF 3D model and use its geometry and materials',
    uniforms: [
      { name: 'modelId', type: 'int', value: 0 },
      { name: 'scale', type: 'float', value: 1.0, min: 0.01, max: 10, step: 0.01 },
      { name: 'rotationY', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
      { name: 'rotationX', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
      { name: 'autoRotate', type: 'float', value: 0.0, min: 0, max: 5, step: 0.1 },
    ],
    code: `// GLB Model - provides geometry data to shader pipeline
vec3 modelPos = vPosition * {{scale}};
float rotY = {{rotationY}} + u_time * {{autoRotate}};
float rotX = {{rotationX}};
modelPos = vec3(
  modelPos.x * cos(rotY) - modelPos.z * sin(rotY),
  modelPos.y * cos(rotX) - modelPos.z * sin(rotX),
  modelPos.x * sin(rotY) + modelPos.z * cos(rotY)
);`,
    inputs: [],
    outputs: ['position', 'normal', 'uv', 'color'],
    color: '#a29bfe',
  },
  {
    type: 'sdf',
    label: 'SDF Shape',
    category: '3D',
    description: 'Signed Distance Field primitives: sphere, box, torus, cylinder, cone',
    uniforms: [
      { name: 'shape', type: 'int', value: 0 },
      { name: 'size', type: 'float', value: 0.3, min: 0.01, max: 2, step: 0.01 },
      { name: 'posX', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
      { name: 'posY', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
      { name: 'smoothness', type: 'float', value: 0.01, min: 0, max: 0.5, step: 0.001 },
      { name: 'roundness', type: 'float', value: 0.0, min: 0, max: 0.5, step: 0.01 },
    ],
    code: `// SDF Shapes: 0=sphere, 1=box, 2=torus, 3=cylinder
vec2 sdfP = vUv - 0.5 - vec2({{posX}}, {{posY}});
float sdfDist = length(sdfP) - {{size}}; // sphere
// Box SDF
vec2 sdfBox = abs(sdfP) - vec2({{size}});
float sdfBoxDist = length(max(sdfBox, 0.0)) + min(max(sdfBox.x, sdfBox.y), 0.0) - {{roundness}};
float sdfShape = smoothstep({{smoothness}}, -{{smoothness}}, sdfDist);`,
    inputs: ['position'],
    outputs: ['distance', 'mask', 'normal'],
    color: '#a29bfe',
  },
  {
    type: 'rayMarch',
    label: 'Ray Marching',
    category: '3D',
    description: 'Ray march through SDFs for true 3D rendering in the fragment shader',
    uniforms: [
      { name: 'maxSteps', type: 'int', value: 64 },
      { name: 'maxDist', type: 'float', value: 10.0, min: 1, max: 100, step: 0.5 },
      { name: 'surfaceDist', type: 'float', value: 0.001, min: 0.0001, max: 0.1, step: 0.001 },
      { name: 'camDist', type: 'float', value: 3.0, min: 0.5, max: 20, step: 0.1 },
      { name: 'fov', type: 'float', value: 1.0, min: 0.1, max: 3, step: 0.1 },
    ],
    code: `// Ray Marching
vec2 rmUv = vUv - 0.5;
vec3 ro = vec3(0.0, 0.0, -{{camDist}}); // ray origin
vec3 rd = normalize(vec3(rmUv * {{fov}}, 1.0)); // ray direction
float rmT = 0.0;
for(int i = 0; i < 64; i++) {
  vec3 p = ro + rd * rmT;
  float d = length(p) - 0.5; // sphere SDF
  if(d < {{surfaceDist}}) break;
  if(rmT > {{maxDist}}) break;
  rmT += d;
}
float rmHit = step(rmT, {{maxDist}});
vec3 rmPos = ro + rd * rmT;
vec3 rmNormal = normalize(rmPos);`,
    inputs: ['sdf'],
    outputs: ['color', 'depth', 'normal', 'hit'],
    color: '#a29bfe',
  },

  // ============================
  // PARTICLE SIMULATION NODES
  // ============================
  {
    type: 'waterSim',
    label: 'Water Simulation',
    category: 'Simulation',
    description: 'Realistic water/liquid particle simulation with waves, ripples, caustics',
    uniforms: [
      { name: 'waveSpeed', type: 'float', value: 1.5, min: 0, max: 5, step: 0.1 },
      { name: 'waveScale', type: 'float', value: 4.0, min: 0.5, max: 20, step: 0.5 },
      { name: 'depth', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'clarity', type: 'float', value: 0.8, min: 0, max: 1, step: 0.01 },
      { name: 'foamAmount', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
      { name: 'deepColor', type: 'vec3', value: [0.0, 0.1, 0.4] },
      { name: 'shallowColor', type: 'vec3', value: [0.0, 0.5, 0.7] },
      { name: 'causticIntensity', type: 'float', value: 0.5, min: 0, max: 2, step: 0.1 },
    ],
    code: `// Water Simulation
float wave1 = sin(vUv.x * {{waveScale}} * 2.0 + u_time * {{waveSpeed}}) * 0.5 + 0.5;
float wave2 = sin(vUv.y * {{waveScale}} * 1.5 + u_time * {{waveSpeed}} * 0.7) * 0.5 + 0.5;
float wave3 = sin((vUv.x + vUv.y) * {{waveScale}} + u_time * {{waveSpeed}} * 1.3) * 0.5 + 0.5;
float waves = (wave1 + wave2 + wave3) / 3.0;
// Caustics
float caustic = sin(vUv.x * 20.0 + u_time) * sin(vUv.y * 20.0 + u_time * 0.8);
caustic = pow(abs(caustic), 3.0) * {{causticIntensity}};
// Foam at wave peaks
float foam = smoothstep(0.7 - {{foamAmount}} * 0.3, 0.85, waves);
// Final water color
vec3 waterColor = mix(vec3({{deepColor}}), vec3({{shallowColor}}), waves * {{depth}});
waterColor += vec3(caustic * {{clarity}});
waterColor += vec3(foam) * 0.8;`,
    inputs: ['uv', 'time', 'normal'],
    outputs: ['color', 'height', 'normal', 'foam'],
    color: '#0abde3',
  },
  {
    type: 'fireSim',
    label: 'Fire Simulation',
    category: 'Simulation',
    description: 'Realistic fire/flame particle simulation with embers and heat distortion',
    uniforms: [
      { name: 'intensity', type: 'float', value: 1.5, min: 0, max: 5, step: 0.1 },
      { name: 'turbulence', type: 'float', value: 3.0, min: 0.5, max: 10, step: 0.5 },
      { name: 'speed', type: 'float', value: 2.0, min: 0.1, max: 5, step: 0.1 },
      { name: 'height', type: 'float', value: 0.7, min: 0.1, max: 1, step: 0.01 },
      { name: 'coreColor', type: 'vec3', value: [1.0, 0.9, 0.3] },
      { name: 'midColor', type: 'vec3', value: [1.0, 0.3, 0.0] },
      { name: 'outerColor', type: 'vec3', value: [0.2, 0.0, 0.0] },
      { name: 'emberCount', type: 'float', value: 30.0, min: 0, max: 100, step: 1 },
      { name: 'heatDistortion', type: 'float', value: 0.02, min: 0, max: 0.1, step: 0.001 },
    ],
    code: `// Fire Simulation
vec2 fireUv = vUv;
fireUv.x += sin(fireUv.y * {{turbulence}} + u_time * {{speed}}) * 0.1;
fireUv.y -= u_time * {{speed}} * 0.3;
float fireNoise = fbm(fireUv * {{turbulence}}, 5, 0.5, 2.0);
float fireShape = smoothstep(1.0, {{height}}, vUv.y) * fireNoise * {{intensity}};
// Heat distortion
float heatWarp = sin(vUv.y * 10.0 + u_time * 5.0) * {{heatDistortion}} * fireShape;
// Color gradient from core to outer
vec3 fireColor = mix(vec3({{outerColor}}), vec3({{midColor}}), fireShape);
fireColor = mix(fireColor, vec3({{coreColor}}), fireShape * fireShape);
// Embers
float embers = 0.0;
for(float i = 0.0; i < {{emberCount}}; i++) {
  vec2 ep = vec2(fract(sin(i * 43.45) * 4378.54), fract(cos(i * 12.98) * 3789.12 - u_time * 0.5 * fract(sin(i * 7.8) * 123.4)));
  ep = fract(ep);
  float ed = length(vUv - ep);
  embers += smoothstep(0.005, 0.0, ed) * step(ep.y, 0.7);
}
fireColor += vec3(1.0, 0.6, 0.1) * embers;`,
    inputs: ['uv', 'time', 'noise'],
    outputs: ['color', 'heat', 'embers'],
    color: '#0abde3',
  },
  {
    type: 'rockSim',
    label: 'Rock / Terrain',
    category: 'Simulation',
    description: 'Procedural rock, stone, terrain generation with erosion and layers',
    uniforms: [
      { name: 'scale', type: 'float', value: 5.0, min: 0.5, max: 30, step: 0.5 },
      { name: 'erosion', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'layers', type: 'int', value: 6 },
      { name: 'crackDensity', type: 'float', value: 0.4, min: 0, max: 1, step: 0.01 },
      { name: 'mossAmount', type: 'float', value: 0.0, min: 0, max: 1, step: 0.01 },
      { name: 'baseColor', type: 'vec3', value: [0.35, 0.3, 0.25] },
      { name: 'darkColor', type: 'vec3', value: [0.15, 0.12, 0.1] },
      { name: 'highlightColor', type: 'vec3', value: [0.6, 0.55, 0.5] },
    ],
    code: `// Rock/Terrain Simulation
float rockNoise = fbm(vUv * {{scale}}, {{layers}}, 0.6, 2.2);
// Erosion - removes sharp features
float eroded = pow(rockNoise, 1.0 + {{erosion}} * 2.0);
// Cracks using voronoi-like pattern
vec2 rockCell = floor(vUv * {{scale}} * 3.0);
float crackDist = 1.0;
for(int x = -1; x <= 1; x++) {
  for(int y = -1; y <= 1; y++) {
    vec2 neighbor = rockCell + vec2(float(x), float(y));
    vec2 point = neighbor + vec2(hash(neighbor), hash(neighbor + 100.0));
    crackDist = min(crackDist, length(vUv * {{scale}} * 3.0 - point));
  }
}
float cracks = smoothstep(0.0, 0.05 + {{crackDensity}} * 0.1, crackDist);
// Layered coloring
vec3 rockColor = mix(vec3({{darkColor}}), vec3({{baseColor}}), eroded);
rockColor = mix(rockColor, vec3({{highlightColor}}), smoothstep(0.6, 0.9, eroded));
rockColor *= cracks;
// Moss on top surfaces
vec3 mossColor = vec3(0.2, 0.4, 0.1);
rockColor = mix(rockColor, mossColor, {{mossAmount}} * smoothstep(0.5, 0.8, rockNoise) * smoothstep(0.3, 0.7, vUv.y));`,
    inputs: ['uv', 'noise'],
    outputs: ['color', 'height', 'normal', 'mask'],
    color: '#0abde3',
  },
  {
    type: 'smokeSim',
    label: 'Smoke Simulation',
    category: 'Simulation',
    description: 'Volumetric smoke and fog with turbulent motion',
    uniforms: [
      { name: 'density', type: 'float', value: 1.0, min: 0, max: 3, step: 0.1 },
      { name: 'speed', type: 'float', value: 0.5, min: 0, max: 3, step: 0.1 },
      { name: 'turbulence', type: 'float', value: 2.0, min: 0, max: 10, step: 0.1 },
      { name: 'dissipation', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
      { name: 'color', type: 'vec3', value: [0.7, 0.7, 0.7] },
      { name: 'lightColor', type: 'vec3', value: [1.0, 0.9, 0.8] },
      { name: 'lightDir', type: 'vec2', value: [0.5, 0.8] },
    ],
    code: `// Smoke Simulation
vec2 smokeUv = vUv;
smokeUv.y -= u_time * {{speed}} * 0.2;
smokeUv.x += sin(vUv.y * 3.0 + u_time) * 0.05 * {{turbulence}};
float smoke1 = fbm(smokeUv * 3.0 + u_time * {{speed}} * 0.1, 5, 0.5, 2.0);
float smoke2 = fbm(smokeUv * 5.0 - u_time * {{speed}} * 0.15, 4, 0.6, 2.2);
float smokeDensity = (smoke1 * 0.6 + smoke2 * 0.4) * {{density}};
// Dissipation at edges
smokeDensity *= smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 1.0 - {{dissipation}}, vUv.y);
smokeDensity *= smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
// Light scattering
float lightScatter = dot(normalize(vec2({{lightDir}})), normalize(smokeUv - 0.5)) * 0.5 + 0.5;
vec3 smokeColor = mix(vec3({{color}}), vec3({{lightColor}}), lightScatter * smokeDensity * 0.5);
smokeColor *= smokeDensity;`,
    inputs: ['uv', 'time', 'noise'],
    outputs: ['color', 'density', 'alpha'],
    color: '#0abde3',
  },
  {
    type: 'sparksSim',
    label: 'Sparks / Electricity',
    category: 'Simulation',
    description: 'Electric sparks, lightning bolts, and electrical arcs',
    uniforms: [
      { name: 'branches', type: 'float', value: 5.0, min: 1, max: 20, step: 1 },
      { name: 'intensity', type: 'float', value: 2.0, min: 0, max: 5, step: 0.1 },
      { name: 'speed', type: 'float', value: 8.0, min: 1, max: 20, step: 0.5 },
      { name: 'thickness', type: 'float', value: 0.02, min: 0.001, max: 0.1, step: 0.001 },
      { name: 'color', type: 'vec3', value: [0.5, 0.7, 1.0] },
      { name: 'glowColor', type: 'vec3', value: [0.2, 0.4, 1.0] },
      { name: 'jitter', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
    ],
    code: `// Sparks / Electricity
float sparks = 0.0;
for(float i = 0.0; i < {{branches}}; i++) {
  float offset = hash(vec2(i, floor(u_time * {{speed}}))) * {{jitter}};
  float boltX = 0.5 + sin(i * 2.4 + u_time * 2.0) * 0.3 + offset;
  float boltY = vUv.y;
  float zigzag = sin(boltY * 20.0 + u_time * {{speed}} + i * 5.0) * 0.05;
  zigzag += sin(boltY * 40.0 + u_time * {{speed}} * 2.0) * 0.02;
  float dist = abs(vUv.x - boltX - zigzag);
  sparks += smoothstep({{thickness}}, 0.0, dist) * {{intensity}};
  // Glow
  sparks += smoothstep({{thickness}} * 5.0, 0.0, dist) * 0.3;
}
vec3 sparkColor = vec3({{color}}) * sparks;
sparkColor += vec3({{glowColor}}) * sparks * 0.3;`,
    inputs: ['uv', 'time'],
    outputs: ['color', 'value'],
    color: '#0abde3',
  },
]

let nodeIdCounter = 0

export function createShaderNode(
  template: NodeTemplate,
  position: { x: number; y: number }
): Node<ShaderNodeData> {
  nodeIdCounter++
  return {
    id: `node_${nodeIdCounter}_${Date.now()}`,
    type: 'shaderNode',
    position,
    data: {
      label: template.label,
      type: template.type,
      uniforms: [...template.uniforms],
      code: template.code,
    },
  }
}

export function generateShaderCode(
  nodes: Node<ShaderNodeData>[],
  edges: Edge[]
): string {
  if (nodes.length === 0) {
    return `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 vUv;

void main() {
  vec2 st = vUv;
  vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
  gl_FragColor = vec4(color, 1.0);
}
`
  }

  let uniforms = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_click;
uniform float u_clickTime;
uniform float u_scroll;
uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_image0;
uniform sampler2D u_video0;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
`

  // Add noise functions
  let functions = `
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2d(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p, int octaves, float persistence, float lacunarity) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float totalAmplitude = 0.0;
  for(int i = 0; i < 8; i++) {
    if(i >= octaves) break;
    value += noise2d(p * frequency) * amplitude;
    totalAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / totalAmplitude;
}
`

  let mainBody = ''
  const processedNodes = new Set<string>()

  // Topological sort based on edges
  const outputNode = nodes.find((n) => n.data.type === 'output')

  // Process all nodes in order
  for (const node of nodes) {
    if (processedNodes.has(node.id)) continue
    processedNodes.add(node.id)

    let code = node.data.code
    // Replace template variables with uniform values
    for (const uniform of node.data.uniforms) {
      const placeholder = `{{${uniform.name}}}`
      if (Array.isArray(uniform.value)) {
        code = code.replace(placeholder, (uniform.value as number[]).join(', '))
      } else {
        code = code.replace(placeholder, String(uniform.value))
      }
    }
    mainBody += `  // ${node.data.label}\n  ${code}\n\n`
  }

  // If no output node, add default output
  if (!outputNode) {
    mainBody += '  vec3 finalColor = vec3(vUv, abs(sin(u_time)));\n'
    mainBody += '  gl_FragColor = vec4(finalColor, 1.0);\n'
  }

  return `${uniforms}\n${functions}\nvoid main() {\n${mainBody}}`
}
