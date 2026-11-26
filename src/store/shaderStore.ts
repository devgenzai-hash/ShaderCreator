import { create } from 'zustand'
import { type Node, type Edge } from '@xyflow/react'

export type ShaderNodeType =
  | 'color'
  | 'math'
  | 'texture'
  | 'noise'
  | 'time'
  | 'mouse'
  | 'uv'
  | 'mix'
  | 'light'
  | 'particles'
  | 'output'
  | 'video'
  | 'image'
  | 'distortion'
  | 'blur'
  | 'glow'
  | 'fresnel'
  | 'normal'
  | 'gradient'
  | 'pattern'
  | 'click'
  | 'scroll'
  | 'audio'
  // New Input nodes
  | 'position'
  | 'uniform'
  | 'resolution'
  // New Processing nodes
  | 'trigonometry'
  | 'vectorOps'
  | 'logicBranch'
  | 'filter'
  | 'step'
  | 'clamp'
  | 'remap'
  // New Color & Lighting nodes
  | 'colorBlend'
  | 'colorCorrect'
  | 'pbrLighting'
  | 'ambientOcclusion'
  | 'shadow'
  // New Geometry/3D nodes
  | 'geometry'
  | 'glbModel'
  | 'sdf'
  | 'rayMarch'
  // New Particle Simulation nodes
  | 'waterSim'
  | 'fireSim'
  | 'rockSim'
  | 'smokeSim'
  | 'sparksSim'

export interface ShaderUniform {
  name: string
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'sampler2D' | 'int' | 'bool'
  value: number | number[] | string
  min?: number
  max?: number
  step?: number
}

export interface ShaderNodeData {
  label: string
  type: ShaderNodeType
  uniforms: ShaderUniform[]
  code: string
  preview?: boolean
}

export interface MediaAsset {
  id: string
  name: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
}

export type ActiveTool = 'shader' | 'font' | 'video-effects'

interface ShaderStore {
  // Active tool
  activeTool: ActiveTool
  setActiveTool: (tool: ActiveTool) => void

  // Shader nodes
  nodes: Node<ShaderNodeData>[]
  edges: Edge[]
  setNodes: (nodes: Node<ShaderNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (node: Node<ShaderNodeData>) => void
  updateNodeData: (nodeId: string, data: Partial<ShaderNodeData>) => void

  // Generated shader code
  vertexShader: string
  fragmentShader: string
  setVertexShader: (code: string) => void
  setFragmentShader: (code: string) => void

  // Media assets
  mediaAssets: MediaAsset[]
  addMediaAsset: (asset: MediaAsset) => void
  removeMediaAsset: (id: string) => void

  // Preview settings
  previewMode: '2d' | '3d'
  setPreviewMode: (mode: '2d' | '3d') => void
  showGrid: boolean
  setShowGrid: (show: boolean) => void
  backgroundColor: string
  setBackgroundColor: (color: string) => void

  // Export
  exportFormat: 'glsl' | 'three' | 'shadertoy' | 'css'
  setExportFormat: (format: 'glsl' | 'three' | 'shadertoy' | 'css') => void
}

const defaultVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const defaultFragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec2 st = vUv;
  vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
  gl_FragColor = vec4(color, 1.0);
}
`

export const useShaderStore = create<ShaderStore>((set) => ({
  activeTool: 'shader',
  setActiveTool: (tool) => set({ activeTool: tool }),

  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    })),

  vertexShader: defaultVertexShader,
  fragmentShader: defaultFragmentShader,
  setVertexShader: (code) => set({ vertexShader: code }),
  setFragmentShader: (code) => set({ fragmentShader: code }),

  mediaAssets: [],
  addMediaAsset: (asset) =>
    set((state) => ({ mediaAssets: [...state.mediaAssets, asset] })),
  removeMediaAsset: (id) =>
    set((state) => ({
      mediaAssets: state.mediaAssets.filter((a) => a.id !== id),
    })),

  previewMode: '2d',
  setPreviewMode: (mode) => set({ previewMode: mode }),
  showGrid: true,
  setShowGrid: (show) => set({ showGrid: show }),
  backgroundColor: '#1a1a2e',
  setBackgroundColor: (color) => set({ backgroundColor: color }),

  exportFormat: 'glsl',
  setExportFormat: (format) => set({ exportFormat: format }),
}))
