import { type Edge } from '@xyflow/react'

export interface PresetNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    type: string
    uniforms: { name: string; type: string; value: number | number[] | string; min?: number; max?: number; step?: number }[]
    code: string
  }
}

export interface ShaderPreset {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string // emoji for now
  nodes: PresetNode[]
  edges: Edge[]
}

export const shaderPresets: ShaderPreset[] = [
  // 1. Animated Gradient
  {
    id: 'animated-gradient',
    name: 'Animated Gradient',
    description: 'A smooth animated color gradient that shifts over time. Great as a background or loading screen.',
    category: 'Backgrounds',
    thumbnail: '🌈',
    nodes: [
      {
        id: 'preset1_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset1_time',
        type: 'shaderNode',
        position: { x: 50, y: 250 },
        data: {
          label: 'Time',
          type: 'time',
          uniforms: [{ name: 'speed', type: 'float', value: 0.5, min: 0, max: 10, step: 0.1 }],
          code: 'float time = u_time * 0.5;',
        },
      },
      {
        id: 'preset1_gradient',
        type: 'shaderNode',
        position: { x: 300, y: 100 },
        data: {
          label: 'Gradient',
          type: 'gradient',
          uniforms: [
            { name: 'colorA', type: 'vec3', value: [0.9, 0.2, 0.4] },
            { name: 'colorB', type: 'vec3', value: [0.1, 0.4, 0.9] },
            { name: 'angle', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
            { name: 'type', type: 'int', value: 0 },
          ],
          code: `vec2 gradUv = vUv;\nfloat gradT = gradUv.x * cos(u_time * 0.5) + gradUv.y * sin(u_time * 0.5);\nvec3 gradient = mix(vec3(0.9, 0.2, 0.4), vec3(0.1, 0.4, 0.9), gradT);`,
        },
      },
      {
        id: 'preset1_output',
        type: 'shaderNode',
        position: { x: 550, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: 'gl_FragColor = vec4(gradient, 1.0);',
        },
      },
    ],
    edges: [
      { id: 'e1-1', source: 'preset1_uv', target: 'preset1_gradient', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e1-2', source: 'preset1_time', target: 'preset1_gradient', sourceHandle: 'time', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e1-3', source: 'preset1_gradient', target: 'preset1_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 2. Mouse-Reactive Ripple
  {
    id: 'mouse-ripple',
    name: 'Mouse Ripple Effect',
    description: 'Creates ripple waves that follow the mouse cursor. Perfect for interactive hero sections.',
    category: 'Interactive',
    thumbnail: '💧',
    nodes: [
      {
        id: 'preset2_uv',
        type: 'shaderNode',
        position: { x: 50, y: 80 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset2_mouse',
        type: 'shaderNode',
        position: { x: 50, y: 230 },
        data: {
          label: 'Mouse Position',
          type: 'mouse',
          uniforms: [
            { name: 'smoothing', type: 'float', value: 0.1, min: 0, max: 1, step: 0.01 },
            { name: 'influence', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
          ],
          code: 'vec2 mouse = u_mouse * 1.0;',
        },
      },
      {
        id: 'preset2_distortion',
        type: 'shaderNode',
        position: { x: 300, y: 120 },
        data: {
          label: 'Distortion',
          type: 'distortion',
          uniforms: [
            { name: 'strength', type: 'float', value: 0.05, min: 0, max: 1, step: 0.01 },
            { name: 'frequency', type: 'float', value: 15.0, min: 0.1, max: 20, step: 0.1 },
            { name: 'speed', type: 'float', value: 3.0, min: 0, max: 5, step: 0.1 },
            { name: 'type', type: 'int', value: 0 },
          ],
          code: `vec2 distortedUv = vUv + vec2(\n  sin(vUv.y * 15.0 + u_time * 3.0) * 0.05,\n  cos(vUv.x * 15.0 + u_time * 3.0) * 0.05\n);`,
        },
      },
      {
        id: 'preset2_color',
        type: 'shaderNode',
        position: { x: 300, y: 300 },
        data: {
          label: 'Solid Color',
          type: 'color',
          uniforms: [{ name: 'color', type: 'vec3', value: [0.2, 0.6, 1.0] }],
          code: 'vec3 solidColor = vec3(0.2, 0.6, 1.0);',
        },
      },
      {
        id: 'preset2_output',
        type: 'shaderNode',
        position: { x: 550, y: 180 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `float ripple = sin(length(vUv - u_mouse) * 30.0 - u_time * 5.0) * 0.5 + 0.5;\nvec3 finalColor = solidColor * ripple;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e2-1', source: 'preset2_uv', target: 'preset2_distortion', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e2-2', source: 'preset2_mouse', target: 'preset2_output', sourceHandle: 'position', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e2-3', source: 'preset2_color', target: 'preset2_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e2-4', source: 'preset2_distortion', target: 'preset2_output', sourceHandle: 'uv', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 3. Particle Field
  {
    id: 'particle-field',
    name: 'Floating Particles',
    description: 'Floating luminous particles that drift upward. Great for magical/space themed sections.',
    category: 'Effects',
    thumbnail: '✨',
    nodes: [
      {
        id: 'preset3_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset3_time',
        type: 'shaderNode',
        position: { x: 50, y: 250 },
        data: {
          label: 'Time',
          type: 'time',
          uniforms: [{ name: 'speed', type: 'float', value: 0.8, min: 0, max: 10, step: 0.1 }],
          code: 'float time = u_time * 0.8;',
        },
      },
      {
        id: 'preset3_particles',
        type: 'shaderNode',
        position: { x: 300, y: 100 },
        data: {
          label: 'Particles',
          type: 'particles',
          uniforms: [
            { name: 'count', type: 'float', value: 80.0, min: 1, max: 200, step: 1 },
            { name: 'size', type: 'float', value: 0.015, min: 0.001, max: 0.2, step: 0.001 },
            { name: 'speed', type: 'float', value: 0.8, min: 0, max: 5, step: 0.1 },
            { name: 'color', type: 'vec3', value: [1.0, 0.9, 0.4] },
            { name: 'spread', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
            { name: 'gravity', type: 'float', value: -0.3, min: -2, max: 2, step: 0.1 },
          ],
          code: `float particles = 0.0;\nfor(float i = 0.0; i < 80.0; i++) {\n  vec2 pos = vec2(\n    fract(sin(i * 12.9898) * 43758.5453) * 1.0,\n    fract(cos(i * 78.233) * 43758.5453 + u_time * 0.8 * (0.5 + fract(sin(i * 45.164) * 43758.5453) * 0.5)) - -0.3 * u_time * 0.1\n  );\n  pos = fract(pos);\n  float d = length(vUv - pos);\n  particles += smoothstep(0.015, 0.0, d);\n}\nvec3 particleColor = vec3(1.0, 0.9, 0.4) * particles;`,
        },
      },
      {
        id: 'preset3_gradient',
        type: 'shaderNode',
        position: { x: 300, y: 300 },
        data: {
          label: 'Gradient',
          type: 'gradient',
          uniforms: [
            { name: 'colorA', type: 'vec3', value: [0.02, 0.02, 0.08] },
            { name: 'colorB', type: 'vec3', value: [0.05, 0.0, 0.15] },
            { name: 'angle', type: 'float', value: 1.57, min: 0, max: 6.28, step: 0.01 },
            { name: 'type', type: 'int', value: 0 },
          ],
          code: `vec2 gradUv = vUv;\nfloat gradT = gradUv.x * cos(1.57) + gradUv.y * sin(1.57);\nvec3 gradient = mix(vec3(0.02, 0.02, 0.08), vec3(0.05, 0.0, 0.15), gradT);`,
        },
      },
      {
        id: 'preset3_output',
        type: 'shaderNode',
        position: { x: 580, y: 180 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: 'vec3 finalColor = gradient + particleColor;\ngl_FragColor = vec4(finalColor, 1.0);',
        },
      },
    ],
    edges: [
      { id: 'e3-1', source: 'preset3_uv', target: 'preset3_particles', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e3-2', source: 'preset3_time', target: 'preset3_particles', sourceHandle: 'time', targetHandle: 'time', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e3-3', source: 'preset3_particles', target: 'preset3_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e3-4', source: 'preset3_gradient', target: 'preset3_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 4. Neon Glow Lines
  {
    id: 'neon-glow',
    name: 'Neon Glow Lines',
    description: 'Glowing neon lines with a cyberpunk aesthetic. Perfect for futuristic/tech websites.',
    category: 'Backgrounds',
    thumbnail: '💡',
    nodes: [
      {
        id: 'preset4_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset4_pattern',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'Pattern',
          type: 'pattern',
          uniforms: [
            { name: 'scale', type: 'float', value: 20.0, min: 1, max: 100, step: 1 },
            { name: 'patternType', type: 'int', value: 0 },
            { name: 'thickness', type: 'float', value: 0.05, min: 0, max: 1, step: 0.01 },
            { name: 'rotation', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
          ],
          code: `float pattern = smoothstep(0.05, 0.0, abs(fract(vUv.y * 20.0 + u_time * 0.5) - 0.5));`,
        },
      },
      {
        id: 'preset4_glow',
        type: 'shaderNode',
        position: { x: 280, y: 250 },
        data: {
          label: 'Glow/Bloom',
          type: 'glow',
          uniforms: [
            { name: 'threshold', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
            { name: 'intensity', type: 'float', value: 2.5, min: 0, max: 5, step: 0.1 },
            { name: 'radius', type: 'float', value: 4.0, min: 0, max: 10, step: 0.1 },
            { name: 'color', type: 'vec3', value: [0.0, 1.0, 0.8] },
          ],
          code: `vec3 glowColor = vec3(0.0, 1.0, 0.8) * pattern * 2.5;`,
        },
      },
      {
        id: 'preset4_output',
        type: 'shaderNode',
        position: { x: 530, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: 'vec3 finalColor = glowColor + vec3(0.02, 0.02, 0.05);\ngl_FragColor = vec4(finalColor, 1.0);',
        },
      },
    ],
    edges: [
      { id: 'e4-1', source: 'preset4_uv', target: 'preset4_pattern', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e4-2', source: 'preset4_pattern', target: 'preset4_glow', sourceHandle: 'value', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e4-3', source: 'preset4_glow', target: 'preset4_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 5. Ocean Waves
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    description: 'Animated ocean wave pattern with depth and foam. Perfect for travel/nature sites.',
    category: 'Nature',
    thumbnail: '🌊',
    nodes: [
      {
        id: 'preset5_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset5_noise',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'Noise Generator',
          type: 'noise',
          uniforms: [
            { name: 'scale', type: 'float', value: 4.0, min: 0.1, max: 50, step: 0.1 },
            { name: 'octaves', type: 'int', value: 5 },
            { name: 'persistence', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'lacunarity', type: 'float', value: 2.0, min: 1, max: 4, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.6, min: 0, max: 5, step: 0.1 },
            { name: 'noiseType', type: 'int', value: 0 },
          ],
          code: `float noise = fbm(vUv * 4.0 + u_time * 0.6, 5, 0.5, 2.0);`,
        },
      },
      {
        id: 'preset5_color1',
        type: 'shaderNode',
        position: { x: 280, y: 280 },
        data: {
          label: 'Solid Color',
          type: 'color',
          uniforms: [{ name: 'color', type: 'vec3', value: [0.0, 0.3, 0.6] }],
          code: 'vec3 deepBlue = vec3(0.0, 0.3, 0.6);',
        },
      },
      {
        id: 'preset5_mix',
        type: 'shaderNode',
        position: { x: 520, y: 150 },
        data: {
          label: 'Mix/Blend',
          type: 'mix',
          uniforms: [
            { name: 'factor', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'blendMode', type: 'int', value: 0 },
          ],
          code: `vec3 foam = vec3(0.8, 0.9, 1.0);\nvec3 mixed = mix(deepBlue, foam, smoothstep(0.55, 0.7, noise));`,
        },
      },
      {
        id: 'preset5_output',
        type: 'shaderNode',
        position: { x: 750, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: 'vec3 finalColor = mixed;\ngl_FragColor = vec4(finalColor, 1.0);',
        },
      },
    ],
    edges: [
      { id: 'e5-1', source: 'preset5_uv', target: 'preset5_noise', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e5-2', source: 'preset5_noise', target: 'preset5_mix', sourceHandle: 'value', targetHandle: 'factor', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e5-3', source: 'preset5_color1', target: 'preset5_mix', sourceHandle: 'color', targetHandle: 'a', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e5-4', source: 'preset5_mix', target: 'preset5_output', sourceHandle: 'result', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 6. Fire/Lava
  {
    id: 'fire-lava',
    name: 'Fire & Lava',
    description: 'Animated fire/lava effect using layered noise. Great for gaming or intense landing pages.',
    category: 'Effects',
    thumbnail: '🔥',
    nodes: [
      {
        id: 'preset6_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset6_noise',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'Noise Generator',
          type: 'noise',
          uniforms: [
            { name: 'scale', type: 'float', value: 6.0, min: 0.1, max: 50, step: 0.1 },
            { name: 'octaves', type: 'int', value: 6 },
            { name: 'persistence', type: 'float', value: 0.55, min: 0, max: 1, step: 0.01 },
            { name: 'lacunarity', type: 'float', value: 2.2, min: 1, max: 4, step: 0.1 },
            { name: 'speed', type: 'float', value: 1.5, min: 0, max: 5, step: 0.1 },
            { name: 'noiseType', type: 'int', value: 0 },
          ],
          code: `float noise = fbm(vUv * 6.0 + vec2(0.0, -u_time * 1.5), 6, 0.55, 2.2);`,
        },
      },
      {
        id: 'preset6_gradient',
        type: 'shaderNode',
        position: { x: 280, y: 300 },
        data: {
          label: 'Gradient',
          type: 'gradient',
          uniforms: [
            { name: 'colorA', type: 'vec3', value: [1.0, 0.1, 0.0] },
            { name: 'colorB', type: 'vec3', value: [1.0, 0.8, 0.0] },
            { name: 'angle', type: 'float', value: 1.57, min: 0, max: 6.28, step: 0.01 },
            { name: 'type', type: 'int', value: 0 },
          ],
          code: `vec3 fireGradient = mix(vec3(1.0, 0.1, 0.0), vec3(1.0, 0.8, 0.0), noise);`,
        },
      },
      {
        id: 'preset6_output',
        type: 'shaderNode',
        position: { x: 550, y: 180 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 finalColor = fireGradient * (noise * 1.5);\nfinalColor += vec3(0.1, 0.0, 0.0);\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e6-1', source: 'preset6_uv', target: 'preset6_noise', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e6-2', source: 'preset6_noise', target: 'preset6_gradient', sourceHandle: 'value', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e6-3', source: 'preset6_gradient', target: 'preset6_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 7. Holographic Fresnel
  {
    id: 'holographic',
    name: 'Holographic Surface',
    description: 'Iridescent holographic effect with rainbow edge glow. Perfect for product showcases.',
    category: '3D',
    thumbnail: '💎',
    nodes: [
      {
        id: 'preset7_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset7_fresnel',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'Fresnel Effect',
          type: 'fresnel',
          uniforms: [
            { name: 'power', type: 'float', value: 3.0, min: 0.1, max: 10, step: 0.1 },
            { name: 'color', type: 'vec3', value: [0.5, 0.8, 1.0] },
            { name: 'intensity', type: 'float', value: 2.0, min: 0, max: 5, step: 0.1 },
          ],
          code: `float fresnelTerm = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);\nvec3 fresnelColor = vec3(0.5, 0.8, 1.0) * fresnelTerm * 2.0;`,
        },
      },
      {
        id: 'preset7_noise',
        type: 'shaderNode',
        position: { x: 280, y: 280 },
        data: {
          label: 'Noise Generator',
          type: 'noise',
          uniforms: [
            { name: 'scale', type: 'float', value: 3.0, min: 0.1, max: 50, step: 0.1 },
            { name: 'octaves', type: 'int', value: 3 },
            { name: 'persistence', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'lacunarity', type: 'float', value: 2.0, min: 1, max: 4, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.3, min: 0, max: 5, step: 0.1 },
            { name: 'noiseType', type: 'int', value: 0 },
          ],
          code: `float holoNoise = fbm(vUv * 3.0 + u_time * 0.3, 3, 0.5, 2.0);`,
        },
      },
      {
        id: 'preset7_output',
        type: 'shaderNode',
        position: { x: 550, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 rainbow = vec3(\n  sin(holoNoise * 6.28 + u_time) * 0.5 + 0.5,\n  sin(holoNoise * 6.28 + u_time + 2.094) * 0.5 + 0.5,\n  sin(holoNoise * 6.28 + u_time + 4.189) * 0.5 + 0.5\n);\nvec3 finalColor = mix(rainbow * 0.3, fresnelColor + rainbow, fresnelTerm);\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e7-1', source: 'preset7_uv', target: 'preset7_noise', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e7-2', source: 'preset7_fresnel', target: 'preset7_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e7-3', source: 'preset7_noise', target: 'preset7_output', sourceHandle: 'value', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 8. Matrix Rain
  {
    id: 'matrix-rain',
    name: 'Matrix Digital Rain',
    description: 'Falling digital characters like The Matrix. Great for hacker/tech/cyberpunk themes.',
    category: 'Effects',
    thumbnail: '🖥️',
    nodes: [
      {
        id: 'preset8_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset8_pattern',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'Pattern',
          type: 'pattern',
          uniforms: [
            { name: 'scale', type: 'float', value: 30.0, min: 1, max: 100, step: 1 },
            { name: 'patternType', type: 'int', value: 0 },
            { name: 'thickness', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'rotation', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
          ],
          code: `vec2 cell = floor(vUv * 30.0);\nfloat columnSpeed = fract(sin(cell.x * 127.1) * 43758.5453) * 2.0 + 1.0;\nfloat drop = fract(cell.y / 30.0 - u_time * columnSpeed * 0.3);\nfloat pattern = smoothstep(0.0, 0.1, drop) * smoothstep(1.0, 0.7, drop);`,
        },
      },
      {
        id: 'preset8_color',
        type: 'shaderNode',
        position: { x: 280, y: 280 },
        data: {
          label: 'Solid Color',
          type: 'color',
          uniforms: [{ name: 'color', type: 'vec3', value: [0.0, 1.0, 0.3] }],
          code: 'vec3 matrixGreen = vec3(0.0, 1.0, 0.3);',
        },
      },
      {
        id: 'preset8_output',
        type: 'shaderNode',
        position: { x: 550, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: 'vec3 finalColor = matrixGreen * pattern * 1.5;\ngl_FragColor = vec4(finalColor, 1.0);',
        },
      },
    ],
    edges: [
      { id: 'e8-1', source: 'preset8_uv', target: 'preset8_pattern', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e8-2', source: 'preset8_pattern', target: 'preset8_output', sourceHandle: 'value', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e8-3', source: 'preset8_color', target: 'preset8_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 9. Liquid Metal
  {
    id: 'liquid-metal',
    name: 'Liquid Metal',
    description: 'Chrome liquid metal with reflections and distortion. High-end product page material.',
    category: '3D',
    thumbnail: '🪩',
    nodes: [
      {
        id: 'preset9_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset9_distortion',
        type: 'shaderNode',
        position: { x: 280, y: 60 },
        data: {
          label: 'Distortion',
          type: 'distortion',
          uniforms: [
            { name: 'strength', type: 'float', value: 0.15, min: 0, max: 1, step: 0.01 },
            { name: 'frequency', type: 'float', value: 3.0, min: 0.1, max: 20, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.8, min: 0, max: 5, step: 0.1 },
            { name: 'type', type: 'int', value: 0 },
          ],
          code: `vec2 distortedUv = vUv + vec2(\n  sin(vUv.y * 3.0 + u_time * 0.8) * 0.15,\n  cos(vUv.x * 3.0 + u_time * 0.8) * 0.15\n);`,
        },
      },
      {
        id: 'preset9_noise',
        type: 'shaderNode',
        position: { x: 280, y: 240 },
        data: {
          label: 'Noise Generator',
          type: 'noise',
          uniforms: [
            { name: 'scale', type: 'float', value: 2.5, min: 0.1, max: 50, step: 0.1 },
            { name: 'octaves', type: 'int', value: 4 },
            { name: 'persistence', type: 'float', value: 0.6, min: 0, max: 1, step: 0.01 },
            { name: 'lacunarity', type: 'float', value: 2.0, min: 1, max: 4, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.4, min: 0, max: 5, step: 0.1 },
            { name: 'noiseType', type: 'int', value: 0 },
          ],
          code: `float metalNoise = fbm(distortedUv * 2.5 + u_time * 0.4, 4, 0.6, 2.0);`,
        },
      },
      {
        id: 'preset9_light',
        type: 'shaderNode',
        position: { x: 530, y: 60 },
        data: {
          label: 'Point Light',
          type: 'light',
          uniforms: [
            { name: 'position', type: 'vec3', value: [1.5, 1.5, 2.0] },
            { name: 'color', type: 'vec3', value: [1.0, 0.95, 0.9] },
            { name: 'intensity', type: 'float', value: 2.0, min: 0, max: 10, step: 0.1 },
            { name: 'falloff', type: 'float', value: 1.5, min: 0.1, max: 10, step: 0.1 },
          ],
          code: `vec3 metalNormal = normalize(vec3(metalNoise - 0.5, metalNoise - 0.5, 1.0));\nvec3 lightDir = normalize(vec3(1.5, 1.5, 2.0) - vPosition);\nfloat spec = pow(max(dot(reflect(-lightDir, metalNormal), vec3(0,0,1)), 0.0), 32.0);\nvec3 lighting = vec3(1.0, 0.95, 0.9) * spec * 2.0;`,
        },
      },
      {
        id: 'preset9_output',
        type: 'shaderNode',
        position: { x: 750, y: 180 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 chrome = vec3(0.8, 0.8, 0.85) * (metalNoise * 0.5 + 0.5) + lighting;\ngl_FragColor = vec4(chrome, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e9-1', source: 'preset9_uv', target: 'preset9_distortion', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e9-2', source: 'preset9_distortion', target: 'preset9_noise', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e9-3', source: 'preset9_noise', target: 'preset9_light', sourceHandle: 'value', targetHandle: 'normal', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e9-4', source: 'preset9_light', target: 'preset9_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // 10. Aurora Borealis
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Northern lights effect with flowing green/purple light curtains. Ethereal and calming.',
    category: 'Nature',
    thumbnail: '🌌',
    nodes: [
      {
        id: 'preset10_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'preset10_noise1',
        type: 'shaderNode',
        position: { x: 280, y: 60 },
        data: {
          label: 'Noise Generator',
          type: 'noise',
          uniforms: [
            { name: 'scale', type: 'float', value: 3.0, min: 0.1, max: 50, step: 0.1 },
            { name: 'octaves', type: 'int', value: 4 },
            { name: 'persistence', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'lacunarity', type: 'float', value: 2.0, min: 1, max: 4, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.3, min: 0, max: 5, step: 0.1 },
            { name: 'noiseType', type: 'int', value: 0 },
          ],
          code: `float aurora1 = fbm(vec2(vUv.x * 3.0, vUv.y * 0.5) + u_time * 0.3, 4, 0.5, 2.0);`,
        },
      },
      {
        id: 'preset10_noise2',
        type: 'shaderNode',
        position: { x: 280, y: 250 },
        data: {
          label: 'Noise Generator',
          type: 'noise',
          uniforms: [
            { name: 'scale', type: 'float', value: 5.0, min: 0.1, max: 50, step: 0.1 },
            { name: 'octaves', type: 'int', value: 3 },
            { name: 'persistence', type: 'float', value: 0.4, min: 0, max: 1, step: 0.01 },
            { name: 'lacunarity', type: 'float', value: 2.5, min: 1, max: 4, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.5, min: 0, max: 5, step: 0.1 },
            { name: 'noiseType', type: 'int', value: 0 },
          ],
          code: `float aurora2 = fbm(vec2(vUv.x * 5.0 + 100.0, vUv.y * 0.3) + u_time * 0.5, 3, 0.4, 2.5);`,
        },
      },
      {
        id: 'preset10_mix',
        type: 'shaderNode',
        position: { x: 530, y: 120 },
        data: {
          label: 'Mix/Blend',
          type: 'mix',
          uniforms: [
            { name: 'factor', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'blendMode', type: 'int', value: 0 },
          ],
          code: `float curtain = smoothstep(0.3, 0.7, aurora1) * smoothstep(0.2, 0.6, aurora2);\ncurtain *= smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.5, vUv.y);\nvec3 auroraColor = mix(vec3(0.1, 0.8, 0.4), vec3(0.4, 0.2, 0.9), aurora2) * curtain * 2.0;`,
        },
      },
      {
        id: 'preset10_output',
        type: 'shaderNode',
        position: { x: 750, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 sky = mix(vec3(0.0, 0.0, 0.05), vec3(0.0, 0.02, 0.1), vUv.y);\nvec3 finalColor = sky + auroraColor;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e10-1', source: 'preset10_uv', target: 'preset10_noise1', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e10-2', source: 'preset10_uv', target: 'preset10_noise2', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e10-3', source: 'preset10_noise1', target: 'preset10_mix', sourceHandle: 'value', targetHandle: 'a', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e10-4', source: 'preset10_noise2', target: 'preset10_mix', sourceHandle: 'value', targetHandle: 'b', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
      { id: 'e10-5', source: 'preset10_mix', target: 'preset10_output', sourceHandle: 'result', targetHandle: 'color', animated: true, style: { stroke: '#e94560', strokeWidth: 2 } },
    ],
  },

  // ========================================
  // ADVANCED PRESETS (Using new nodes)
  // ========================================

  // 11. PBR Chrome Sphere with Ray Marching
  {
    id: 'pbr-chrome-sphere',
    name: 'PBR Chrome Sphere',
    description: 'A ray-marched 3D sphere with physically-based chrome material, specular highlights, and environment reflections.',
    category: 'Advanced 3D',
    thumbnail: '🔮',
    nodes: [
      {
        id: 'p11_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p11_raymarch',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'Ray Marching',
          type: 'rayMarch',
          uniforms: [
            { name: 'maxSteps', type: 'int', value: 64 },
            { name: 'maxDist', type: 'float', value: 10.0, min: 1, max: 100, step: 0.5 },
            { name: 'surfaceDist', type: 'float', value: 0.001, min: 0.0001, max: 0.1, step: 0.001 },
            { name: 'camDist', type: 'float', value: 3.0, min: 0.5, max: 20, step: 0.1 },
            { name: 'fov', type: 'float', value: 1.0, min: 0.1, max: 3, step: 0.1 },
          ],
          code: `vec2 rmUv = vUv - 0.5;\nvec3 ro = vec3(0.0, 0.0, -3.0);\nvec3 rd = normalize(vec3(rmUv * 1.0, 1.0));\nfloat rmT = 0.0;\nfor(int i = 0; i < 64; i++) {\n  vec3 p = ro + rd * rmT;\n  float d = length(p) - 0.8;\n  if(d < 0.001) break;\n  if(rmT > 10.0) break;\n  rmT += d;\n}\nvec3 rmPos = ro + rd * rmT;\nvec3 rmNormal = normalize(rmPos);\nfloat rmHit = step(rmT, 9.0);`,
        },
      },
      {
        id: 'p11_pbr',
        type: 'shaderNode',
        position: { x: 540, y: 60 },
        data: {
          label: 'PBR Lighting',
          type: 'pbrLighting',
          uniforms: [
            { name: 'lightPos', type: 'vec3', value: [2.0, 2.0, -2.0] },
            { name: 'lightColor', type: 'vec3', value: [1.0, 0.98, 0.95] },
            { name: 'metallic', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 },
            { name: 'roughness', type: 'float', value: 0.15, min: 0.01, max: 1, step: 0.01 },
            { name: 'ambientStrength', type: 'float', value: 0.05, min: 0, max: 1, step: 0.01 },
            { name: 'albedo', type: 'vec3', value: [0.95, 0.93, 0.88] },
          ],
          code: `vec3 N = rmNormal;\nvec3 V = normalize(vec3(0.0, 0.0, -1.0) - rmPos);\nvec3 L = normalize(vec3(2.0, 2.0, -2.0) - rmPos);\nvec3 H = normalize(V + L);\nfloat NdotL = max(dot(N, L), 0.0);\nfloat NdotH = max(dot(N, H), 0.0);\nfloat NdotV = max(dot(N, V), 0.001);\nfloat roughSq = 0.15 * 0.15;\nfloat D = roughSq / (3.14159 * pow(NdotH * NdotH * (roughSq - 1.0) + 1.0, 2.0));\nvec3 F0 = vec3(0.95, 0.93, 0.88);\nvec3 F = F0 + (1.0 - F0) * pow(1.0 - max(dot(H, V), 0.0), 5.0);\nvec3 specular = D * F * 0.25 / max(NdotL * NdotV, 0.001);\nvec3 envReflect = reflect(-V, N);\nvec3 envColor = mix(vec3(0.1, 0.15, 0.3), vec3(0.8, 0.9, 1.0), envReflect.y * 0.5 + 0.5);\nvec3 pbrColor = (specular + envColor * F) * vec3(1.0, 0.98, 0.95) * NdotL + vec3(0.95, 0.93, 0.88) * 0.05;`,
        },
      },
      {
        id: 'p11_fresnel',
        type: 'shaderNode',
        position: { x: 540, y: 280 },
        data: {
          label: 'Fresnel Effect',
          type: 'fresnel',
          uniforms: [
            { name: 'power', type: 'float', value: 4.0, min: 0.1, max: 10, step: 0.1 },
            { name: 'color', type: 'vec3', value: [0.6, 0.8, 1.0] },
            { name: 'intensity', type: 'float', value: 1.5, min: 0, max: 5, step: 0.1 },
          ],
          code: `float fresnelTerm = pow(1.0 - max(dot(rmNormal, normalize(vec3(0.0, 0.0, -1.0) - rmPos)), 0.0), 4.0);\nvec3 fresnelColor = vec3(0.6, 0.8, 1.0) * fresnelTerm * 1.5;`,
        },
      },
      {
        id: 'p11_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 bgGrad = mix(vec3(0.02, 0.02, 0.06), vec3(0.08, 0.06, 0.12), vUv.y);\nvec3 finalColor = mix(bgGrad, pbrColor + fresnelColor, rmHit);\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e11-1', source: 'p11_uv', target: 'p11_raymarch', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e11-2', source: 'p11_raymarch', target: 'p11_pbr', sourceHandle: 'normal', targetHandle: 'normal', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e11-3', source: 'p11_raymarch', target: 'p11_fresnel', sourceHandle: 'normal', targetHandle: 'normal', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e11-4', source: 'p11_pbr', target: 'p11_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e11-5', source: 'p11_fresnel', target: 'p11_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
    ],
  },

  // 12. Underwater Caustics
  {
    id: 'underwater-caustics',
    name: 'Underwater Caustics',
    description: 'Deep underwater scene with dancing caustic light patterns, floating particles, and color-corrected depth fog.',
    category: 'Advanced Effects',
    thumbnail: '🫧',
    nodes: [
      {
        id: 'p12_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p12_water',
        type: 'shaderNode',
        position: { x: 280, y: 60 },
        data: {
          label: 'Water Simulation',
          type: 'waterSim',
          uniforms: [
            { name: 'waveSpeed', type: 'float', value: 1.2, min: 0, max: 5, step: 0.1 },
            { name: 'waveScale', type: 'float', value: 6.0, min: 0.5, max: 20, step: 0.5 },
            { name: 'depth', type: 'float', value: 0.8, min: 0, max: 1, step: 0.01 },
            { name: 'clarity', type: 'float', value: 0.6, min: 0, max: 1, step: 0.01 },
            { name: 'foamAmount', type: 'float', value: 0.0, min: 0, max: 1, step: 0.01 },
            { name: 'deepColor', type: 'vec3', value: [0.0, 0.03, 0.15] },
            { name: 'shallowColor', type: 'vec3', value: [0.0, 0.2, 0.4] },
            { name: 'causticIntensity', type: 'float', value: 1.2, min: 0, max: 2, step: 0.1 },
          ],
          code: `float wave1 = sin(vUv.x * 12.0 + u_time * 1.2) * 0.5 + 0.5;\nfloat wave2 = sin(vUv.y * 9.0 + u_time * 0.84) * 0.5 + 0.5;\nfloat wave3 = sin((vUv.x + vUv.y) * 6.0 + u_time * 1.56) * 0.5 + 0.5;\nfloat waves = (wave1 + wave2 + wave3) / 3.0;\nfloat caustic1 = sin(vUv.x * 25.0 + u_time * 2.0 + sin(vUv.y * 15.0 + u_time));\nfloat caustic2 = sin(vUv.y * 30.0 - u_time * 1.5 + cos(vUv.x * 20.0 - u_time * 0.7));\nfloat caustic = pow(abs(caustic1 * caustic2), 2.0) * 1.2;\nvec3 waterColor = mix(vec3(0.0, 0.03, 0.15), vec3(0.0, 0.2, 0.4), waves * 0.8);\nwaterColor += vec3(0.1, 0.4, 0.6) * caustic * 0.6;`,
        },
      },
      {
        id: 'p12_particles',
        type: 'shaderNode',
        position: { x: 280, y: 280 },
        data: {
          label: 'Particles',
          type: 'particles',
          uniforms: [
            { name: 'count', type: 'float', value: 40.0, min: 1, max: 200, step: 1 },
            { name: 'size', type: 'float', value: 0.008, min: 0.001, max: 0.2, step: 0.001 },
            { name: 'speed', type: 'float', value: 0.3, min: 0, max: 5, step: 0.1 },
            { name: 'color', type: 'vec3', value: [0.4, 0.8, 1.0] },
            { name: 'spread', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
            { name: 'gravity', type: 'float', value: -0.1, min: -2, max: 2, step: 0.1 },
          ],
          code: `float bubbles = 0.0;\nfor(float i = 0.0; i < 40.0; i++) {\n  vec2 pos = vec2(\n    fract(sin(i * 12.9898) * 43758.5453) * 1.0,\n    fract(cos(i * 78.233) * 43758.5453 + u_time * 0.3 * (0.5 + fract(sin(i * 45.164) * 43758.5453) * 0.5)) + 0.1 * u_time * 0.1\n  );\n  pos = fract(pos);\n  float d = length(vUv - pos);\n  bubbles += smoothstep(0.008, 0.0, d) * 0.6;\n  bubbles += smoothstep(0.015, 0.008, d) * 0.15;\n}\nvec3 bubbleColor = vec3(0.4, 0.8, 1.0) * bubbles;`,
        },
      },
      {
        id: 'p12_colorCorrect',
        type: 'shaderNode',
        position: { x: 560, y: 120 },
        data: {
          label: 'Color Correction',
          type: 'colorCorrect',
          uniforms: [
            { name: 'brightness', type: 'float', value: -0.05, min: -1, max: 1, step: 0.01 },
            { name: 'contrast', type: 'float', value: 1.3, min: 0, max: 3, step: 0.01 },
            { name: 'saturation', type: 'float', value: 1.4, min: 0, max: 3, step: 0.01 },
            { name: 'hueShift', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
            { name: 'gamma', type: 'float', value: 0.9, min: 0.1, max: 3, step: 0.01 },
            { name: 'exposure', type: 'float', value: 0.2, min: -3, max: 3, step: 0.1 },
          ],
          code: `vec3 corrected = waterColor + bubbleColor;\ncorrected = corrected + (-0.05);\ncorrected = (corrected - 0.5) * 1.3 + 0.5;\nfloat luma = dot(corrected, vec3(0.2126, 0.7152, 0.0722));\ncorrected = mix(vec3(luma), corrected, 1.4);\ncorrected = pow(max(corrected, vec3(0.0)), vec3(1.0 / 0.9));\ncorrected *= exp2(0.2);`,
        },
      },
      {
        id: 'p12_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 finalColor = corrected;\nfloat vignette = 1.0 - length(vUv - 0.5) * 0.8;\nfinalColor *= vignette;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e12-1', source: 'p12_uv', target: 'p12_water', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e12-2', source: 'p12_uv', target: 'p12_particles', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e12-3', source: 'p12_water', target: 'p12_colorCorrect', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e12-4', source: 'p12_particles', target: 'p12_colorCorrect', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e12-5', source: 'p12_colorCorrect', target: 'p12_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
    ],
  },

  // 13. Volcanic Terrain
  {
    id: 'volcanic-terrain',
    name: 'Volcanic Terrain',
    description: 'Procedural volcanic landscape with lava cracks, rock texture, fire embers, and smoke plumes.',
    category: 'Advanced Effects',
    thumbnail: '🌋',
    nodes: [
      {
        id: 'p13_uv',
        type: 'shaderNode',
        position: { x: 50, y: 150 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p13_rock',
        type: 'shaderNode',
        position: { x: 280, y: 50 },
        data: {
          label: 'Rock / Terrain',
          type: 'rockSim',
          uniforms: [
            { name: 'scale', type: 'float', value: 8.0, min: 0.5, max: 30, step: 0.5 },
            { name: 'erosion', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
            { name: 'layers', type: 'int', value: 6 },
            { name: 'crackDensity', type: 'float', value: 0.7, min: 0, max: 1, step: 0.01 },
            { name: 'mossAmount', type: 'float', value: 0.0, min: 0, max: 1, step: 0.01 },
            { name: 'baseColor', type: 'vec3', value: [0.15, 0.1, 0.08] },
            { name: 'darkColor', type: 'vec3', value: [0.05, 0.03, 0.02] },
            { name: 'highlightColor', type: 'vec3', value: [0.25, 0.2, 0.15] },
          ],
          code: `float rockNoise = fbm(vUv * 8.0, 6, 0.6, 2.2);\nfloat eroded = pow(rockNoise, 1.6);\nvec2 rockCell = floor(vUv * 24.0);\nfloat crackDist = 1.0;\nfor(int x = -1; x <= 1; x++) {\n  for(int y = -1; y <= 1; y++) {\n    vec2 neighbor = rockCell + vec2(float(x), float(y));\n    vec2 point = neighbor + vec2(hash(neighbor), hash(neighbor + 100.0));\n    crackDist = min(crackDist, length(vUv * 24.0 - point));\n  }\n}\nfloat cracks = smoothstep(0.0, 0.12, crackDist);\nvec3 rockColor = mix(vec3(0.05, 0.03, 0.02), vec3(0.15, 0.1, 0.08), eroded);\nrockColor = mix(rockColor, vec3(0.25, 0.2, 0.15), smoothstep(0.6, 0.9, eroded));\nrockColor *= cracks;`,
        },
      },
      {
        id: 'p13_fire',
        type: 'shaderNode',
        position: { x: 280, y: 280 },
        data: {
          label: 'Fire Simulation',
          type: 'fireSim',
          uniforms: [
            { name: 'intensity', type: 'float', value: 2.0, min: 0, max: 5, step: 0.1 },
            { name: 'turbulence', type: 'float', value: 4.0, min: 0.5, max: 10, step: 0.5 },
            { name: 'speed', type: 'float', value: 1.5, min: 0.1, max: 5, step: 0.1 },
            { name: 'height', type: 'float', value: 0.6, min: 0.1, max: 1, step: 0.01 },
            { name: 'coreColor', type: 'vec3', value: [1.0, 0.95, 0.5] },
            { name: 'midColor', type: 'vec3', value: [1.0, 0.4, 0.0] },
            { name: 'outerColor', type: 'vec3', value: [0.4, 0.0, 0.0] },
            { name: 'emberCount', type: 'float', value: 20.0, min: 0, max: 100, step: 1 },
            { name: 'heatDistortion', type: 'float', value: 0.015, min: 0, max: 0.1, step: 0.001 },
          ],
          code: `// Lava in cracks\nfloat lavaMask = 1.0 - cracks;\nfloat lavaFlow = fbm(vUv * 4.0 + vec2(0.0, -u_time * 0.3), 4, 0.5, 2.0);\nvec3 lavaColor = mix(vec3(0.4, 0.0, 0.0), vec3(1.0, 0.4, 0.0), lavaFlow);\nlavaColor = mix(lavaColor, vec3(1.0, 0.95, 0.5), lavaFlow * lavaFlow);\nlavaColor *= lavaMask * 2.0;\n// Embers\nfloat embers = 0.0;\nfor(float i = 0.0; i < 20.0; i++) {\n  vec2 ep = vec2(fract(sin(i * 43.45) * 4378.54), fract(cos(i * 12.98) * 3789.12 - u_time * 0.4));\n  ep = fract(ep);\n  embers += smoothstep(0.004, 0.0, length(vUv - ep)) * step(0.6, 1.0 - ep.y);\n}\nvec3 emberColor = vec3(1.0, 0.5, 0.1) * embers;`,
        },
      },
      {
        id: 'p13_smoke',
        type: 'shaderNode',
        position: { x: 560, y: 280 },
        data: {
          label: 'Smoke Simulation',
          type: 'smokeSim',
          uniforms: [
            { name: 'density', type: 'float', value: 0.4, min: 0, max: 3, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.3, min: 0, max: 3, step: 0.1 },
            { name: 'turbulence', type: 'float', value: 2.0, min: 0, max: 10, step: 0.1 },
            { name: 'dissipation', type: 'float', value: 0.6, min: 0, max: 1, step: 0.01 },
            { name: 'color', type: 'vec3', value: [0.3, 0.2, 0.15] },
            { name: 'lightColor', type: 'vec3', value: [1.0, 0.5, 0.2] },
            { name: 'lightDir', type: 'vec2', value: [0.5, 0.8] },
          ],
          code: `vec2 smokeUv = vUv;\nsmokeUv.y -= u_time * 0.06;\nfloat smoke = fbm(smokeUv * 3.0 + u_time * 0.05, 4, 0.5, 2.0) * 0.4;\nsmoke *= smoothstep(0.5, 0.9, vUv.y) * smoothstep(1.0, 0.7, vUv.y);\nvec3 smokeColor = mix(vec3(0.3, 0.2, 0.15), vec3(1.0, 0.5, 0.2), smoke) * smoke;`,
        },
      },
      {
        id: 'p13_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 finalColor = rockColor + lavaColor + emberColor + smokeColor;\nfinalColor = pow(finalColor, vec3(0.9));\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e13-1', source: 'p13_uv', target: 'p13_rock', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#ff6b6b', strokeWidth: 2 } },
      { id: 'e13-2', source: 'p13_uv', target: 'p13_fire', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#ff6b6b', strokeWidth: 2 } },
      { id: 'e13-3', source: 'p13_rock', target: 'p13_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#ff6b6b', strokeWidth: 2 } },
      { id: 'e13-4', source: 'p13_fire', target: 'p13_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#ff6b6b', strokeWidth: 2 } },
      { id: 'e13-5', source: 'p13_smoke', target: 'p13_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#ff6b6b', strokeWidth: 2 } },
    ],
  },

  // 14. Electric Plasma Orb
  {
    id: 'electric-plasma-orb',
    name: 'Electric Plasma Orb',
    description: 'A glowing SDF sphere surrounded by crackling electricity, dynamic sparks, and plasma aura.',
    category: 'Advanced 3D',
    thumbnail: '⚡',
    nodes: [
      {
        id: 'p14_uv',
        type: 'shaderNode',
        position: { x: 50, y: 150 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p14_sdf',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'SDF Shape',
          type: 'sdf',
          uniforms: [
            { name: 'shape', type: 'int', value: 0 },
            { name: 'size', type: 'float', value: 0.2, min: 0.01, max: 2, step: 0.01 },
            { name: 'posX', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
            { name: 'posY', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
            { name: 'smoothness', type: 'float', value: 0.02, min: 0, max: 0.5, step: 0.001 },
            { name: 'roundness', type: 'float', value: 0.0, min: 0, max: 0.5, step: 0.01 },
          ],
          code: `vec2 sdfP = vUv - 0.5;\nfloat sdfDist = length(sdfP) - 0.2;\nfloat orbMask = smoothstep(0.02, -0.02, sdfDist);\nfloat orbEdge = smoothstep(0.05, 0.0, abs(sdfDist));\nfloat orbGlow = smoothstep(0.3, 0.0, sdfDist) * 0.5;`,
        },
      },
      {
        id: 'p14_sparks',
        type: 'shaderNode',
        position: { x: 280, y: 300 },
        data: {
          label: 'Sparks / Electricity',
          type: 'sparksSim',
          uniforms: [
            { name: 'branches', type: 'float', value: 8.0, min: 1, max: 20, step: 1 },
            { name: 'intensity', type: 'float', value: 2.5, min: 0, max: 5, step: 0.1 },
            { name: 'speed', type: 'float', value: 12.0, min: 1, max: 20, step: 0.5 },
            { name: 'thickness', type: 'float', value: 0.012, min: 0.001, max: 0.1, step: 0.001 },
            { name: 'color', type: 'vec3', value: [0.5, 0.8, 1.0] },
            { name: 'glowColor', type: 'vec3', value: [0.2, 0.4, 1.0] },
            { name: 'jitter', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
          ],
          code: `float sparks = 0.0;\nfor(float i = 0.0; i < 8.0; i++) {\n  float angle = i * 0.785 + u_time * 0.5;\n  vec2 dir = vec2(cos(angle), sin(angle));\n  float offset = hash(vec2(i, floor(u_time * 12.0))) * 0.5;\n  vec2 boltStart = vec2(0.5) + dir * 0.2;\n  vec2 boltEnd = vec2(0.5) + dir * (0.35 + offset * 0.15);\n  vec2 toPoint = vUv - boltStart;\n  vec2 boltDir = normalize(boltEnd - boltStart);\n  float proj = clamp(dot(toPoint, boltDir), 0.0, length(boltEnd - boltStart));\n  vec2 closest = boltStart + boltDir * proj;\n  float zigzag = sin(proj * 40.0 + u_time * 12.0 + i * 3.0) * 0.015;\n  zigzag += sin(proj * 80.0 + u_time * 20.0) * 0.007;\n  float dist = length(vUv - closest - vec2(-boltDir.y, boltDir.x) * zigzag);\n  sparks += smoothstep(0.012, 0.0, dist) * 2.5;\n  sparks += smoothstep(0.04, 0.0, dist) * 0.4;\n}\nvec3 sparkColor = vec3(0.5, 0.8, 1.0) * sparks;\nsparkColor += vec3(0.2, 0.4, 1.0) * sparks * 0.3;`,
        },
      },
      {
        id: 'p14_trig',
        type: 'shaderNode',
        position: { x: 560, y: 80 },
        data: {
          label: 'Trigonometry',
          type: 'trigonometry',
          uniforms: [
            { name: 'function', type: 'int', value: 0 },
            { name: 'input', type: 'float', value: 0.0, min: -6.28, max: 6.28, step: 0.01 },
            { name: 'frequency', type: 'float', value: 3.0, min: 0.1, max: 20, step: 0.1 },
            { name: 'amplitude', type: 'float', value: 0.5, min: 0, max: 10, step: 0.1 },
            { name: 'offset', type: 'float', value: 0.5, min: -5, max: 5, step: 0.01 },
          ],
          code: `float pulse = sin(u_time * 3.0) * 0.5 + 0.5;\nvec3 coreGlow = mix(vec3(0.3, 0.5, 1.0), vec3(0.7, 0.9, 1.0), pulse) * orbMask * 2.0;`,
        },
      },
      {
        id: 'p14_output',
        type: 'shaderNode',
        position: { x: 800, y: 180 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 aura = vec3(0.1, 0.2, 0.5) * orbGlow;\nvec3 finalColor = vec3(0.01, 0.01, 0.03);\nfinalColor += coreGlow;\nfinalColor += sparkColor * (1.0 - orbMask);\nfinalColor += aura;\nfinalColor += vec3(0.4, 0.7, 1.0) * orbEdge * (1.0 + pulse);\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e14-1', source: 'p14_uv', target: 'p14_sdf', sourceHandle: 'uv', targetHandle: 'position', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e14-2', source: 'p14_uv', target: 'p14_sparks', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e14-3', source: 'p14_sdf', target: 'p14_trig', sourceHandle: 'mask', targetHandle: 'value', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e14-4', source: 'p14_trig', target: 'p14_output', sourceHandle: 'result', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e14-5', source: 'p14_sparks', target: 'p14_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
    ],
  },

  // 15. Cyberpunk City Rain
  {
    id: 'cyberpunk-rain',
    name: 'Cyberpunk City Rain',
    description: 'Neon-soaked rain streaks with color bleed, distortion, and a moody cyberpunk color palette.',
    category: 'Advanced Effects',
    thumbnail: '🌃',
    nodes: [
      {
        id: 'p15_uv',
        type: 'shaderNode',
        position: { x: 50, y: 150 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p15_distortion',
        type: 'shaderNode',
        position: { x: 280, y: 60 },
        data: {
          label: 'Distortion',
          type: 'distortion',
          uniforms: [
            { name: 'strength', type: 'float', value: 0.008, min: 0, max: 1, step: 0.001 },
            { name: 'frequency', type: 'float', value: 40.0, min: 0.1, max: 50, step: 0.1 },
            { name: 'speed', type: 'float', value: 8.0, min: 0, max: 10, step: 0.1 },
            { name: 'type', type: 'int', value: 0 },
          ],
          code: `// Rain streaks\nfloat rainStreak = 0.0;\nfor(float i = 0.0; i < 30.0; i++) {\n  float x = fract(sin(i * 127.1) * 43758.5453);\n  float speed = 2.0 + fract(cos(i * 78.2) * 12345.6) * 4.0;\n  float y = fract(vUv.y * (1.0 + fract(sin(i * 45.2) * 1234.5) * 2.0) - u_time * speed);\n  float streak = smoothstep(0.003, 0.0, abs(vUv.x - x)) * smoothstep(0.0, 0.15, y) * smoothstep(0.5, 0.2, y);\n  rainStreak += streak;\n}\n// Droplet distortion\nvec2 distortedUv = vUv + vec2(sin(vUv.y * 40.0 + u_time * 8.0) * 0.008 * rainStreak, 0.0);`,
        },
      },
      {
        id: 'p15_colorBlend',
        type: 'shaderNode',
        position: { x: 280, y: 280 },
        data: {
          label: 'Color Blend',
          type: 'colorBlend',
          uniforms: [
            { name: 'blendMode', type: 'int', value: 2 },
            { name: 'opacity', type: 'float', value: 0.8, min: 0, max: 1, step: 0.01 },
          ],
          code: `// Neon reflections on wet surface\nfloat neon1 = smoothstep(0.02, 0.0, abs(sin(vUv.x * 30.0 + sin(vUv.y * 5.0 + u_time * 0.3)) * 0.5));\nfloat neon2 = smoothstep(0.03, 0.0, abs(sin(vUv.x * 15.0 - u_time * 0.2) * cos(vUv.y * 8.0)));\nvec3 neonPink = vec3(1.0, 0.1, 0.5) * neon1 * 1.5;\nvec3 neonCyan = vec3(0.0, 0.9, 1.0) * neon2 * 1.2;\nvec3 neonBlend = neonPink + neonCyan;`,
        },
      },
      {
        id: 'p15_colorCorrect',
        type: 'shaderNode',
        position: { x: 560, y: 150 },
        data: {
          label: 'Color Correction',
          type: 'colorCorrect',
          uniforms: [
            { name: 'brightness', type: 'float', value: -0.1, min: -1, max: 1, step: 0.01 },
            { name: 'contrast', type: 'float', value: 1.5, min: 0, max: 3, step: 0.01 },
            { name: 'saturation', type: 'float', value: 1.6, min: 0, max: 3, step: 0.01 },
            { name: 'hueShift', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
            { name: 'gamma', type: 'float', value: 0.85, min: 0.1, max: 3, step: 0.01 },
            { name: 'exposure', type: 'float', value: 0.3, min: -3, max: 3, step: 0.1 },
          ],
          code: `// Wet ground gradient\nvec3 wetGround = mix(vec3(0.02, 0.01, 0.04), vec3(0.05, 0.03, 0.08), vUv.y);\n// Combine\nvec3 scene = wetGround + neonBlend * (0.3 + rainStreak * 0.5);\nscene += vec3(0.7, 0.8, 1.0) * rainStreak * 0.4;\n// Color correct\nscene = (scene - 0.5) * 1.5 + 0.5;\nfloat sceneLuma = dot(scene, vec3(0.2126, 0.7152, 0.0722));\nscene = mix(vec3(sceneLuma), scene, 1.6);\nscene = pow(max(scene, vec3(0.0)), vec3(1.0 / 0.85)) * exp2(0.3);`,
        },
      },
      {
        id: 'p15_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 finalColor = scene;\nfinalColor *= 1.0 - length(vUv - 0.5) * 0.6;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e15-1', source: 'p15_uv', target: 'p15_distortion', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#ff9ff3', strokeWidth: 2 } },
      { id: 'e15-2', source: 'p15_uv', target: 'p15_colorBlend', sourceHandle: 'uv', targetHandle: 'base', animated: true, style: { stroke: '#ff9ff3', strokeWidth: 2 } },
      { id: 'e15-3', source: 'p15_distortion', target: 'p15_colorCorrect', sourceHandle: 'uv', targetHandle: 'color', animated: true, style: { stroke: '#ff9ff3', strokeWidth: 2 } },
      { id: 'e15-4', source: 'p15_colorBlend', target: 'p15_colorCorrect', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#ff9ff3', strokeWidth: 2 } },
      { id: 'e15-5', source: 'p15_colorCorrect', target: 'p15_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#ff9ff3', strokeWidth: 2 } },
    ],
  },

  // 16. Morphing SDF Shapes
  {
    id: 'morphing-sdf',
    name: 'Morphing SDF Shapes',
    description: 'Smooth morphing between sphere, box, and torus SDFs with PBR shading and animated transitions.',
    category: 'Advanced 3D',
    thumbnail: '🫠',
    nodes: [
      {
        id: 'p16_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p16_sdf',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'SDF Shape',
          type: 'sdf',
          uniforms: [
            { name: 'shape', type: 'int', value: 0 },
            { name: 'size', type: 'float', value: 0.35, min: 0.01, max: 2, step: 0.01 },
            { name: 'posX', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
            { name: 'posY', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
            { name: 'smoothness', type: 'float', value: 0.015, min: 0, max: 0.5, step: 0.001 },
            { name: 'roundness', type: 'float', value: 0.05, min: 0, max: 0.5, step: 0.01 },
          ],
          code: `// Morphing SDFs\nvec2 p = vUv - 0.5;\nfloat morphTime = u_time * 0.5;\nfloat morphFactor = sin(morphTime) * 0.5 + 0.5;\n// Sphere\nfloat sphere = length(p) - 0.25;\n// Rounded box\nvec2 boxD = abs(p) - vec2(0.2);\nfloat box = length(max(boxD, 0.0)) + min(max(boxD.x, boxD.y), 0.0) - 0.05;\n// Morph\nfloat morphDist = mix(sphere, box, morphFactor);\n// Animate size with breathing\nmorphDist -= sin(u_time * 2.0) * 0.02;\nfloat morphMask = smoothstep(0.015, -0.015, morphDist);\nfloat morphEdge = smoothstep(0.04, 0.0, abs(morphDist));`,
        },
      },
      {
        id: 'p16_trig',
        type: 'shaderNode',
        position: { x: 280, y: 300 },
        data: {
          label: 'Trigonometry',
          type: 'trigonometry',
          uniforms: [
            { name: 'function', type: 'int', value: 0 },
            { name: 'input', type: 'float', value: 0.0, min: -6.28, max: 6.28, step: 0.01 },
            { name: 'frequency', type: 'float', value: 1.0, min: 0.1, max: 20, step: 0.1 },
            { name: 'amplitude', type: 'float', value: 1.0, min: 0, max: 10, step: 0.1 },
            { name: 'offset', type: 'float', value: 0.0, min: -5, max: 5, step: 0.01 },
          ],
          code: `// Animated color cycling\nvec3 morphColor1 = vec3(0.1 + sin(u_time * 0.7) * 0.1, 0.4, 0.9);\nvec3 morphColor2 = vec3(0.9, 0.2 + cos(u_time * 0.5) * 0.2, 0.5);\nvec3 shapeFill = mix(morphColor1, morphColor2, morphFactor);`,
        },
      },
      {
        id: 'p16_glow',
        type: 'shaderNode',
        position: { x: 560, y: 80 },
        data: {
          label: 'Glow/Bloom',
          type: 'glow',
          uniforms: [
            { name: 'threshold', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
            { name: 'intensity', type: 'float', value: 2.0, min: 0, max: 5, step: 0.1 },
            { name: 'radius', type: 'float', value: 5.0, min: 0, max: 10, step: 0.1 },
            { name: 'color', type: 'vec3', value: [0.5, 0.7, 1.0] },
          ],
          code: `// Edge glow\nvec3 edgeGlow = mix(morphColor1, morphColor2, 0.5) * morphEdge * 3.0;\n// Outer aura\nfloat auraDist = smoothstep(0.35, 0.0, length(vUv - 0.5) - 0.25);\nvec3 aura = mix(morphColor1, morphColor2, 0.5) * auraDist * 0.3 * (1.0 - morphMask);`,
        },
      },
      {
        id: 'p16_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 bg = mix(vec3(0.02, 0.02, 0.05), vec3(0.05, 0.02, 0.08), vUv.y);\nvec3 finalColor = bg + shapeFill * morphMask + edgeGlow + aura;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e16-1', source: 'p16_uv', target: 'p16_sdf', sourceHandle: 'uv', targetHandle: 'position', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e16-2', source: 'p16_sdf', target: 'p16_trig', sourceHandle: 'mask', targetHandle: 'value', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e16-3', source: 'p16_sdf', target: 'p16_glow', sourceHandle: 'mask', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e16-4', source: 'p16_trig', target: 'p16_output', sourceHandle: 'result', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e16-5', source: 'p16_glow', target: 'p16_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
    ],
  },

  // 17. Interactive Smoke & Fire
  {
    id: 'smoke-fire-interactive',
    name: 'Interactive Smoke Portal',
    description: 'Mouse-reactive smoke portal with fire ring, swirling vortex, and color-corrected atmosphere.',
    category: 'Advanced Effects',
    thumbnail: '🕳️',
    nodes: [
      {
        id: 'p17_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p17_mouse',
        type: 'shaderNode',
        position: { x: 50, y: 260 },
        data: {
          label: 'Mouse Position',
          type: 'mouse',
          uniforms: [
            { name: 'smoothing', type: 'float', value: 0.1, min: 0, max: 1, step: 0.01 },
            { name: 'influence', type: 'float', value: 1.0, min: 0, max: 5, step: 0.1 },
          ],
          code: 'vec2 mouse = u_mouse;',
        },
      },
      {
        id: 'p17_smoke',
        type: 'shaderNode',
        position: { x: 300, y: 60 },
        data: {
          label: 'Smoke Simulation',
          type: 'smokeSim',
          uniforms: [
            { name: 'density', type: 'float', value: 1.5, min: 0, max: 3, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.8, min: 0, max: 3, step: 0.1 },
            { name: 'turbulence', type: 'float', value: 4.0, min: 0, max: 10, step: 0.1 },
            { name: 'dissipation', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
            { name: 'color', type: 'vec3', value: [0.4, 0.2, 0.6] },
            { name: 'lightColor', type: 'vec3', value: [1.0, 0.5, 0.2] },
            { name: 'lightDir', type: 'vec2', value: [0.5, 0.8] },
          ],
          code: `// Vortex distortion toward center/mouse\nvec2 center = mix(vec2(0.5), mouse, 0.5);\nvec2 toCenter = vUv - center;\nfloat dist = length(toCenter);\nfloat angle = atan(toCenter.y, toCenter.x);\nfloat vortex = angle + u_time * 1.5 + (1.0 / (dist + 0.1)) * 0.1;\nvec2 vortexUv = center + vec2(cos(vortex), sin(vortex)) * dist;\n// Smoke with vortex\nvec2 smokeUv = vortexUv;\nsmokeUv.y -= u_time * 0.16;\nsmokeUv += sin(vortexUv.yx * 4.0 + u_time) * 0.05;\nfloat smoke1 = fbm(smokeUv * 3.0, 5, 0.5, 2.0);\nfloat smoke2 = fbm(smokeUv * 5.0 - u_time * 0.1, 4, 0.6, 2.2);\nfloat smokeDensity = (smoke1 * 0.6 + smoke2 * 0.4) * 1.5;\nsmokeDensity *= smoothstep(0.0, 0.15, dist) * smoothstep(0.5, 0.25, dist);\nvec3 smokeColor = mix(vec3(0.4, 0.2, 0.6), vec3(1.0, 0.5, 0.2), smokeDensity * 0.5) * smokeDensity;`,
        },
      },
      {
        id: 'p17_fire',
        type: 'shaderNode',
        position: { x: 300, y: 310 },
        data: {
          label: 'Fire Simulation',
          type: 'fireSim',
          uniforms: [
            { name: 'intensity', type: 'float', value: 3.0, min: 0, max: 5, step: 0.1 },
            { name: 'turbulence', type: 'float', value: 5.0, min: 0.5, max: 10, step: 0.5 },
            { name: 'speed', type: 'float', value: 3.0, min: 0.1, max: 5, step: 0.1 },
            { name: 'height', type: 'float', value: 0.8, min: 0.1, max: 1, step: 0.01 },
            { name: 'coreColor', type: 'vec3', value: [1.0, 0.9, 0.6] },
            { name: 'midColor', type: 'vec3', value: [1.0, 0.3, 0.1] },
            { name: 'outerColor', type: 'vec3', value: [0.5, 0.0, 0.3] },
            { name: 'emberCount', type: 'float', value: 0.0, min: 0, max: 100, step: 1 },
            { name: 'heatDistortion', type: 'float', value: 0.0, min: 0, max: 0.1, step: 0.001 },
          ],
          code: `// Fire ring around portal\nfloat ringDist = abs(dist - 0.2) - 0.03;\nfloat ringMask = smoothstep(0.03, 0.0, ringDist);\nfloat fireNoise = fbm(vec2(angle * 2.0, u_time * 3.0), 4, 0.5, 2.0);\nvec3 fireRing = mix(vec3(0.5, 0.0, 0.3), vec3(1.0, 0.3, 0.1), fireNoise);\nfireRing = mix(fireRing, vec3(1.0, 0.9, 0.6), fireNoise * fireNoise);\nfireRing *= ringMask * 3.0 * (0.7 + fireNoise * 0.5);`,
        },
      },
      {
        id: 'p17_output',
        type: 'shaderNode',
        position: { x: 620, y: 180 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `// Dark void in center\nfloat voidMask = smoothstep(0.15, 0.05, dist);\nvec3 voidColor = vec3(0.02, 0.0, 0.05) * voidMask;\nvec3 bg = vec3(0.02, 0.01, 0.04);\nvec3 finalColor = bg + smokeColor + fireRing + voidColor;\nfinalColor = pow(finalColor, vec3(0.9));\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e17-1', source: 'p17_uv', target: 'p17_smoke', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#c44569', strokeWidth: 2 } },
      { id: 'e17-2', source: 'p17_mouse', target: 'p17_smoke', sourceHandle: 'position', targetHandle: 'uv', animated: true, style: { stroke: '#c44569', strokeWidth: 2 } },
      { id: 'e17-3', source: 'p17_uv', target: 'p17_fire', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#c44569', strokeWidth: 2 } },
      { id: 'e17-4', source: 'p17_smoke', target: 'p17_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#c44569', strokeWidth: 2 } },
      { id: 'e17-5', source: 'p17_fire', target: 'p17_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#c44569', strokeWidth: 2 } },
    ],
  },

  // 18. Fluid Gradient Mesh
  {
    id: 'fluid-gradient-mesh',
    name: 'Fluid Gradient Mesh',
    description: 'Modern fluid multi-color gradient like Apple/Stripe backgrounds, with smooth organic motion and vivid colors.',
    category: 'Advanced Effects',
    thumbnail: '🎨',
    nodes: [
      {
        id: 'p18_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p18_trig',
        type: 'shaderNode',
        position: { x: 280, y: 60 },
        data: {
          label: 'Trigonometry',
          type: 'trigonometry',
          uniforms: [
            { name: 'function', type: 'int', value: 0 },
            { name: 'input', type: 'float', value: 0.0, min: -6.28, max: 6.28, step: 0.01 },
            { name: 'frequency', type: 'float', value: 0.3, min: 0.1, max: 20, step: 0.1 },
            { name: 'amplitude', type: 'float', value: 0.3, min: 0, max: 10, step: 0.1 },
            { name: 'offset', type: 'float', value: 0.5, min: -5, max: 5, step: 0.01 },
          ],
          code: `// Animated blob positions\nvec2 blob1 = vec2(sin(u_time * 0.3) * 0.3 + 0.5, cos(u_time * 0.4) * 0.3 + 0.5);\nvec2 blob2 = vec2(cos(u_time * 0.25) * 0.35 + 0.5, sin(u_time * 0.35 + 2.0) * 0.35 + 0.5);\nvec2 blob3 = vec2(sin(u_time * 0.2 + 4.0) * 0.3 + 0.5, cos(u_time * 0.3 + 1.0) * 0.3 + 0.5);\nvec2 blob4 = vec2(cos(u_time * 0.35 + 3.0) * 0.25 + 0.5, sin(u_time * 0.45 + 5.0) * 0.25 + 0.5);`,
        },
      },
      {
        id: 'p18_noise',
        type: 'shaderNode',
        position: { x: 280, y: 260 },
        data: {
          label: 'Noise Generator',
          type: 'noise',
          uniforms: [
            { name: 'scale', type: 'float', value: 2.0, min: 0.1, max: 50, step: 0.1 },
            { name: 'octaves', type: 'int', value: 3 },
            { name: 'persistence', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'lacunarity', type: 'float', value: 2.0, min: 1, max: 4, step: 0.1 },
            { name: 'speed', type: 'float', value: 0.2, min: 0, max: 5, step: 0.1 },
            { name: 'noiseType', type: 'int', value: 0 },
          ],
          code: `// Organic distortion\nfloat orgNoise = fbm(vUv * 2.0 + u_time * 0.2, 3, 0.5, 2.0) * 0.1;`,
        },
      },
      {
        id: 'p18_colorBlend',
        type: 'shaderNode',
        position: { x: 560, y: 120 },
        data: {
          label: 'Color Blend',
          type: 'colorBlend',
          uniforms: [
            { name: 'blendMode', type: 'int', value: 1 },
            { name: 'opacity', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 },
          ],
          code: `// Distance-based color blobs\nvec2 distUv = vUv + orgNoise;\nfloat d1 = smoothstep(0.5, 0.0, length(distUv - blob1));\nfloat d2 = smoothstep(0.5, 0.0, length(distUv - blob2));\nfloat d3 = smoothstep(0.45, 0.0, length(distUv - blob3));\nfloat d4 = smoothstep(0.4, 0.0, length(distUv - blob4));\n// Rich color palette\nvec3 col1 = vec3(0.98, 0.2, 0.45); // Hot pink\nvec3 col2 = vec3(0.2, 0.4, 0.98);  // Royal blue\nvec3 col3 = vec3(0.1, 0.9, 0.7);   // Teal\nvec3 col4 = vec3(0.95, 0.6, 0.1);  // Amber\nvec3 base = vec3(0.12, 0.05, 0.2);  // Deep purple base\nvec3 fluidColor = base;\nfluidColor = mix(fluidColor, col1, d1);\nfluidColor = mix(fluidColor, col2, d2);\nfluidColor = mix(fluidColor, col3, d3);\nfluidColor = mix(fluidColor, col4, d4);`,
        },
      },
      {
        id: 'p18_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 finalColor = fluidColor;\n// Subtle grain for texture\nfinalColor += (hash(vUv * u_resolution + u_time) - 0.5) * 0.02;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e18-1', source: 'p18_uv', target: 'p18_trig', sourceHandle: 'uv', targetHandle: 'value', animated: true, style: { stroke: '#feca57', strokeWidth: 2 } },
      { id: 'e18-2', source: 'p18_uv', target: 'p18_noise', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#feca57', strokeWidth: 2 } },
      { id: 'e18-3', source: 'p18_trig', target: 'p18_colorBlend', sourceHandle: 'result', targetHandle: 'base', animated: true, style: { stroke: '#feca57', strokeWidth: 2 } },
      { id: 'e18-4', source: 'p18_noise', target: 'p18_colorBlend', sourceHandle: 'value', targetHandle: 'blend', animated: true, style: { stroke: '#feca57', strokeWidth: 2 } },
      { id: 'e18-5', source: 'p18_colorBlend', target: 'p18_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#feca57', strokeWidth: 2 } },
    ],
  },

  // 19. Ray Marched Infinite Tunnel
  {
    id: 'infinite-tunnel',
    name: 'Infinite Tunnel',
    description: 'Ray-marched infinite tunnel with procedural walls, lighting, and depth fog. Mesmerizing forward motion.',
    category: 'Advanced 3D',
    thumbnail: '🕳️',
    nodes: [
      {
        id: 'p19_uv',
        type: 'shaderNode',
        position: { x: 50, y: 100 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p19_raymarch',
        type: 'shaderNode',
        position: { x: 280, y: 80 },
        data: {
          label: 'Ray Marching',
          type: 'rayMarch',
          uniforms: [
            { name: 'maxSteps', type: 'int', value: 48 },
            { name: 'maxDist', type: 'float', value: 20.0, min: 1, max: 100, step: 0.5 },
            { name: 'surfaceDist', type: 'float', value: 0.01, min: 0.001, max: 0.1, step: 0.001 },
            { name: 'camDist', type: 'float', value: 0.0, min: 0.5, max: 20, step: 0.1 },
            { name: 'fov', type: 'float', value: 1.2, min: 0.1, max: 3, step: 0.1 },
          ],
          code: `// Infinite tunnel ray march\nvec2 tunnelUv = vUv - 0.5;\nvec3 tRo = vec3(0.0, 0.0, u_time * 2.0);\nvec3 tRd = normalize(vec3(tunnelUv * 1.2, 1.0));\nfloat tT = 0.0;\nvec3 tHitPos = tRo;\nfor(int i = 0; i < 48; i++) {\n  tHitPos = tRo + tRd * tT;\n  // Tunnel SDF: cylinder inversion\n  float tunnelDist = -(length(tHitPos.xy) - 1.5) + sin(tHitPos.z * 0.5) * 0.2 + sin(tHitPos.z * 2.0 + tHitPos.x * 3.0) * 0.05;\n  if(tunnelDist < 0.01) break;\n  if(tT > 20.0) break;\n  tT += tunnelDist * 0.5;\n}\nfloat tunnelHit = step(tT, 19.0);\nvec3 tunnelNormal = normalize(vec3(-tHitPos.xy, 0.0) + vec3(0.0, 0.0, cos(tHitPos.z * 0.5) * 0.1));`,
        },
      },
      {
        id: 'p19_pattern',
        type: 'shaderNode',
        position: { x: 280, y: 300 },
        data: {
          label: 'Pattern',
          type: 'pattern',
          uniforms: [
            { name: 'scale', type: 'float', value: 10.0, min: 1, max: 100, step: 1 },
            { name: 'patternType', type: 'int', value: 0 },
            { name: 'thickness', type: 'float', value: 0.5, min: 0, max: 1, step: 0.01 },
            { name: 'rotation', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
          ],
          code: `// Grid pattern on tunnel walls\nfloat wallPattern = step(0.9, fract(tHitPos.z * 2.0)) + step(0.9, fract(atan(tHitPos.y, tHitPos.x) * 5.0 / 3.14159));\nwallPattern = clamp(wallPattern, 0.0, 1.0) * 0.3;`,
        },
      },
      {
        id: 'p19_colorCorrect',
        type: 'shaderNode',
        position: { x: 560, y: 150 },
        data: {
          label: 'Color Correction',
          type: 'colorCorrect',
          uniforms: [
            { name: 'brightness', type: 'float', value: 0.0, min: -1, max: 1, step: 0.01 },
            { name: 'contrast', type: 'float', value: 1.4, min: 0, max: 3, step: 0.01 },
            { name: 'saturation', type: 'float', value: 1.5, min: 0, max: 3, step: 0.01 },
            { name: 'hueShift', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
            { name: 'gamma', type: 'float', value: 0.9, min: 0.1, max: 3, step: 0.01 },
            { name: 'exposure', type: 'float', value: 0.0, min: -3, max: 3, step: 0.1 },
          ],
          code: `// Tunnel color with depth\nfloat depthFog = exp(-tT * 0.15);\nvec3 tunnelWallColor = vec3(0.05, 0.02, 0.1);\n// Neon rings\nfloat neonRing = smoothstep(0.02, 0.0, abs(fract(tHitPos.z * 0.5) - 0.5) - 0.47);\nvec3 neonColor = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 0.0, 0.6), sin(tHitPos.z * 0.2) * 0.5 + 0.5) * neonRing * 3.0;\n// Combine\nvec3 tunnelColor = (tunnelWallColor + wallPattern + neonColor) * depthFog * tunnelHit;\ntunnelColor = (tunnelColor - 0.5) * 1.4 + 0.5;\nfloat tLuma = dot(tunnelColor, vec3(0.2126, 0.7152, 0.0722));\ntunnelColor = mix(vec3(tLuma), tunnelColor, 1.5);\ntunnelColor = pow(max(tunnelColor, vec3(0.0)), vec3(1.0 / 0.9));`,
        },
      },
      {
        id: 'p19_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 finalColor = tunnelColor;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e19-1', source: 'p19_uv', target: 'p19_raymarch', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e19-2', source: 'p19_raymarch', target: 'p19_pattern', sourceHandle: 'depth', targetHandle: 'uv', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e19-3', source: 'p19_raymarch', target: 'p19_colorCorrect', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e19-4', source: 'p19_pattern', target: 'p19_colorCorrect', sourceHandle: 'value', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
      { id: 'e19-5', source: 'p19_colorCorrect', target: 'p19_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#a29bfe', strokeWidth: 2 } },
    ],
  },

  // 20. Stormy Ocean with Lightning
  {
    id: 'stormy-ocean',
    name: 'Stormy Ocean',
    description: 'Turbulent ocean with high waves, dramatic lightning flashes, rain, and cinematic color grading.',
    category: 'Advanced Effects',
    thumbnail: '⛈️',
    nodes: [
      {
        id: 'p20_uv',
        type: 'shaderNode',
        position: { x: 50, y: 150 },
        data: {
          label: 'UV Coordinates',
          type: 'uv',
          uniforms: [],
          code: 'vec2 uv = vUv;',
        },
      },
      {
        id: 'p20_water',
        type: 'shaderNode',
        position: { x: 280, y: 50 },
        data: {
          label: 'Water Simulation',
          type: 'waterSim',
          uniforms: [
            { name: 'waveSpeed', type: 'float', value: 2.5, min: 0, max: 5, step: 0.1 },
            { name: 'waveScale', type: 'float', value: 3.0, min: 0.5, max: 20, step: 0.5 },
            { name: 'depth', type: 'float', value: 0.9, min: 0, max: 1, step: 0.01 },
            { name: 'clarity', type: 'float', value: 0.3, min: 0, max: 1, step: 0.01 },
            { name: 'foamAmount', type: 'float', value: 0.7, min: 0, max: 1, step: 0.01 },
            { name: 'deepColor', type: 'vec3', value: [0.01, 0.03, 0.08] },
            { name: 'shallowColor', type: 'vec3', value: [0.05, 0.15, 0.25] },
            { name: 'causticIntensity', type: 'float', value: 0.2, min: 0, max: 2, step: 0.1 },
          ],
          code: `// Stormy waves (more aggressive)\nfloat sWave1 = sin(vUv.x * 6.0 + u_time * 2.5 + sin(vUv.y * 3.0) * 2.0) * 0.5 + 0.5;\nfloat sWave2 = sin(vUv.y * 4.5 + u_time * 1.75 + cos(vUv.x * 5.0) * 1.5) * 0.5 + 0.5;\nfloat sWave3 = sin((vUv.x * 0.7 + vUv.y * 1.3) * 3.0 + u_time * 3.25) * 0.5 + 0.5;\nfloat stormWaves = pow((sWave1 + sWave2 + sWave3) / 3.0, 0.7);\n// Foam\nfloat stormFoam = smoothstep(0.55, 0.8, stormWaves) * 0.7;\nfloat foamDetail = fbm(vUv * 15.0 + u_time * 0.5, 3, 0.6, 2.0);\nstormFoam *= step(0.4, foamDetail);\n// Ocean color\nvec3 oceanColor = mix(vec3(0.01, 0.03, 0.08), vec3(0.05, 0.15, 0.25), stormWaves * 0.9);\noceanColor += vec3(0.8, 0.85, 0.9) * stormFoam;`,
        },
      },
      {
        id: 'p20_sparks',
        type: 'shaderNode',
        position: { x: 280, y: 300 },
        data: {
          label: 'Sparks / Electricity',
          type: 'sparksSim',
          uniforms: [
            { name: 'branches', type: 'float', value: 3.0, min: 1, max: 20, step: 1 },
            { name: 'intensity', type: 'float', value: 4.0, min: 0, max: 5, step: 0.1 },
            { name: 'speed', type: 'float', value: 15.0, min: 1, max: 20, step: 0.5 },
            { name: 'thickness', type: 'float', value: 0.008, min: 0.001, max: 0.1, step: 0.001 },
            { name: 'color', type: 'vec3', value: [0.9, 0.9, 1.0] },
            { name: 'glowColor', type: 'vec3', value: [0.5, 0.5, 0.8] },
            { name: 'jitter', type: 'float', value: 0.8, min: 0, max: 1, step: 0.01 },
          ],
          code: `// Lightning in sky\nfloat lightning = 0.0;\nfloat lightningFlash = 0.0;\nfloat stormTime = floor(u_time * 0.5);\nfloat lightningChance = fract(sin(stormTime * 127.1) * 43758.5453);\nif(lightningChance > 0.6 && vUv.y > 0.5) {\n  float lBolt = 0.0;\n  for(float i = 0.0; i < 3.0; i++) {\n    float lx = 0.3 + hash(vec2(i, stormTime)) * 0.4;\n    float zigzag = sin(vUv.y * 30.0 + i * 10.0 + stormTime * 5.0) * 0.04;\n    zigzag += sin(vUv.y * 60.0 + i * 20.0) * 0.02;\n    float ld = abs(vUv.x - lx - zigzag);\n    lBolt += smoothstep(0.008, 0.0, ld) * smoothstep(0.5, 0.9, vUv.y) * 4.0;\n    lBolt += smoothstep(0.04, 0.0, ld) * smoothstep(0.5, 0.8, vUv.y) * 0.5;\n  }\n  float flashDecay = fract(u_time * 0.5);\n  flashDecay = exp(-flashDecay * 5.0);\n  lightning = lBolt * flashDecay;\n  lightningFlash = flashDecay * 0.3 * step(0.7, lightningChance);\n}\nvec3 lightningColor = vec3(0.9, 0.9, 1.0) * lightning;`,
        },
      },
      {
        id: 'p20_colorCorrect',
        type: 'shaderNode',
        position: { x: 560, y: 150 },
        data: {
          label: 'Color Correction',
          type: 'colorCorrect',
          uniforms: [
            { name: 'brightness', type: 'float', value: -0.05, min: -1, max: 1, step: 0.01 },
            { name: 'contrast', type: 'float', value: 1.3, min: 0, max: 3, step: 0.01 },
            { name: 'saturation', type: 'float', value: 0.8, min: 0, max: 3, step: 0.01 },
            { name: 'hueShift', type: 'float', value: 0.0, min: 0, max: 6.28, step: 0.01 },
            { name: 'gamma', type: 'float', value: 1.1, min: 0.1, max: 3, step: 0.01 },
            { name: 'exposure', type: 'float', value: 0.0, min: -3, max: 3, step: 0.1 },
          ],
          code: `// Sky gradient\nvec3 skyColor = mix(vec3(0.02, 0.02, 0.05), vec3(0.15, 0.12, 0.2), smoothstep(0.5, 1.0, vUv.y));\n// Horizon blend\nvec3 stormScene = mix(oceanColor, skyColor, smoothstep(0.4, 0.6, vUv.y));\nstormScene += lightningColor;\nstormScene += lightningFlash;\n// Rain\nfloat rain = 0.0;\nfor(float i = 0.0; i < 50.0; i++) {\n  float rx = fract(sin(i * 127.1) * 43758.5453);\n  float ry = fract(vUv.y * 2.0 - u_time * (3.0 + fract(cos(i * 78.2) * 12345.6) * 3.0) + sin(i) * 100.0);\n  rain += smoothstep(0.001, 0.0, abs(vUv.x - rx)) * smoothstep(0.0, 0.03, ry) * smoothstep(0.15, 0.05, ry) * 0.3;\n}\nstormScene += vec3(0.5, 0.55, 0.6) * rain * 0.5;\n// Grade\nstormScene = (stormScene - 0.5) * 1.3 + 0.5;\nstormScene = pow(max(stormScene, vec3(0.0)), vec3(1.0 / 1.1));`,
        },
      },
      {
        id: 'p20_output',
        type: 'shaderNode',
        position: { x: 800, y: 150 },
        data: {
          label: 'Shader Output',
          type: 'output',
          uniforms: [{ name: 'alpha', type: 'float', value: 1.0, min: 0, max: 1, step: 0.01 }],
          code: `vec3 finalColor = stormScene;\nfinalColor *= 1.0 - smoothstep(0.5, 1.4, length(vUv - vec2(0.5, 0.5))) * 0.4;\ngl_FragColor = vec4(finalColor, 1.0);`,
        },
      },
    ],
    edges: [
      { id: 'e20-1', source: 'p20_uv', target: 'p20_water', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e20-2', source: 'p20_uv', target: 'p20_sparks', sourceHandle: 'uv', targetHandle: 'uv', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e20-3', source: 'p20_water', target: 'p20_colorCorrect', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e20-4', source: 'p20_sparks', target: 'p20_colorCorrect', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
      { id: 'e20-5', source: 'p20_colorCorrect', target: 'p20_output', sourceHandle: 'color', targetHandle: 'color', animated: true, style: { stroke: '#0abde3', strokeWidth: 2 } },
    ],
  },
]
