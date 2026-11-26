import { type Node } from '@xyflow/react'
import { ShaderNodeData, ShaderUniform } from '../store/shaderStore'
import { nodeTemplates } from '../engine/shaderNodes'
import { useState } from 'react'
import MediaUploader from './MediaUploader'

interface Props {
  selectedNode: Node<ShaderNodeData> | null
  onDataChange: (nodeId: string, data: Partial<ShaderNodeData>) => void
}

export default function PropertiesPanel({ selectedNode, onDataChange }: Props) {
  const [activeTab, setActiveTab] = useState<'properties' | 'media'>('properties')

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex border-b border-editor-accent">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 px-3 py-2 text-xs ${activeTab === 'properties' ? 'bg-editor-accent text-white' : 'text-gray-400'}`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 px-3 py-2 text-xs ${activeTab === 'media' ? 'bg-editor-accent text-white' : 'text-gray-400'}`}
          >
            Media
          </button>
        </div>

        {activeTab === 'media' ? (
          <MediaUploader />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-xs text-gray-500 text-center">
              Select a node to edit its properties
            </p>
          </div>
        )}
      </div>
    )
  }

  const template = nodeTemplates.find((t) => t.type === selectedNode.data.type)

  const handleUniformChange = (uniformName: string, value: number | number[] | string) => {
    const updatedUniforms = selectedNode.data.uniforms.map((u) =>
      u.name === uniformName ? { ...u, value } : u
    )
    onDataChange(selectedNode.id, { uniforms: updatedUniforms })
  }

  return (
    <div className="h-full flex flex-col bg-editor-panel overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-editor-accent">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: template?.color || '#666' }}
          />
          <span className="text-sm font-semibold text-editor-text">
            {selectedNode.data.label}
          </span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          {template?.description}
        </p>
      </div>

      {/* Uniforms */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {selectedNode.data.uniforms.map((uniform) => (
          <UniformControl
            key={uniform.name}
            uniform={uniform}
            onChange={(value) => handleUniformChange(uniform.name, value)}
          />
        ))}
      </div>

      {/* Node Info */}
      <div className="p-3 border-t border-editor-accent">
        <div className="text-[10px] text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Inputs:</span>
            <span>{template?.inputs.join(', ') || 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span>Outputs:</span>
            <span>{template?.outputs.join(', ') || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function UniformControl({
  uniform,
  onChange,
}: {
  uniform: ShaderUniform
  onChange: (value: number | number[] | string) => void
}) {
  if (uniform.type === 'vec3' && Array.isArray(uniform.value)) {
    // Check if it's likely a color (name contains 'color')
    const isColor = uniform.name.toLowerCase().includes('color')

    if (isColor) {
      const rgb = uniform.value as number[]
      const hexColor = `#${Math.round(rgb[0] * 255).toString(16).padStart(2, '0')}${Math.round(rgb[1] * 255).toString(16).padStart(2, '0')}${Math.round(rgb[2] * 255).toString(16).padStart(2, '0')}`

      return (
        <div>
          <label className="text-[10px] text-gray-400 block mb-1">{uniform.name}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hexColor}
              onChange={(e) => {
                const hex = e.target.value
                const r = parseInt(hex.slice(1, 3), 16) / 255
                const g = parseInt(hex.slice(3, 5), 16) / 255
                const b = parseInt(hex.slice(5, 7), 16) / 255
                onChange([r, g, b])
              }}
              className="w-8 h-8"
            />
            <span className="text-[10px] text-gray-500 font-mono">{hexColor}</span>
          </div>
        </div>
      )
    }

    return (
      <div>
        <label className="text-[10px] text-gray-400 block mb-1">{uniform.name}</label>
        <div className="space-y-1">
          {['x', 'y', 'z'].map((axis, i) => (
            <div key={axis} className="flex items-center gap-2">
              <span className="text-[9px] text-gray-500 w-3">{axis}</span>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.1}
                value={(uniform.value as number[])[i]}
                onChange={(e) => {
                  const newVal = [...(uniform.value as number[])]
                  newVal[i] = parseFloat(e.target.value)
                  onChange(newVal)
                }}
                className="flex-1"
              />
              <span className="text-[9px] text-gray-500 w-8 text-right font-mono">
                {(uniform.value as number[])[i].toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (uniform.type === 'vec2' && Array.isArray(uniform.value)) {
    return (
      <div>
        <label className="text-[10px] text-gray-400 block mb-1">{uniform.name}</label>
        <div className="space-y-1">
          {['x', 'y'].map((axis, i) => (
            <div key={axis} className="flex items-center gap-2">
              <span className="text-[9px] text-gray-500 w-3">{axis}</span>
              <input
                type="range"
                min={uniform.min ?? -5}
                max={uniform.max ?? 5}
                step={uniform.step ?? 0.1}
                value={(uniform.value as number[])[i]}
                onChange={(e) => {
                  const newVal = [...(uniform.value as number[])]
                  newVal[i] = parseFloat(e.target.value)
                  onChange(newVal)
                }}
                className="flex-1"
              />
              <span className="text-[9px] text-gray-500 w-8 text-right font-mono">
                {(uniform.value as number[])[i].toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (uniform.type === 'float') {
    return (
      <div>
        <label className="text-[10px] text-gray-400 block mb-1">{uniform.name}</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={uniform.min ?? 0}
            max={uniform.max ?? 1}
            step={uniform.step ?? 0.01}
            value={uniform.value as number}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-[10px] text-gray-500 w-10 text-right font-mono">
            {(uniform.value as number).toFixed(2)}
          </span>
        </div>
      </div>
    )
  }

  if (uniform.type === 'int') {
    return (
      <div>
        <label className="text-[10px] text-gray-400 block mb-1">{uniform.name}</label>
        <input
          type="number"
          value={uniform.value as number}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full px-2 py-1 bg-editor-bg border border-editor-accent rounded text-xs text-editor-text"
        />
      </div>
    )
  }

  if (uniform.type === 'bool') {
    return (
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-gray-400">{uniform.name}</label>
        <button
          onClick={() => onChange(uniform.value === 1 ? 0 : 1)}
          className={`w-8 h-4 rounded-full transition-colors ${
            uniform.value === 1 ? 'bg-editor-highlight' : 'bg-editor-accent'
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full bg-white transition-transform ${
              uniform.value === 1 ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    )
  }

  return null
}
