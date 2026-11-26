import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { ShaderNodeData } from '../../store/shaderStore'
import { nodeTemplates } from '../../engine/shaderNodes'

interface ShaderNodeProps {
  data: ShaderNodeData
  selected?: boolean
}

function ShaderNodeComponent({ data, selected }: ShaderNodeProps) {
  const template = nodeTemplates.find((t) => t.type === data.type)
  const color = template?.color || '#666'
  const inputs = template?.inputs || []
  const outputs = template?.outputs || []

  return (
    <div
      className={`rounded-lg border-2 min-w-[160px] shadow-lg transition-shadow ${
        selected ? 'shadow-xl' : ''
      }`}
      style={{
        borderColor: selected ? color : `${color}66`,
        background: '#1e1e3a',
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-1.5 rounded-t-md flex items-center gap-2"
        style={{ background: `${color}22` }}
      >
        <div
          className="w-2.5 h-2.5 rounded-sm"
          style={{ background: color }}
        />
        <span className="text-[11px] font-semibold text-gray-200">
          {data.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 space-y-1">
        {data.uniforms.slice(0, 3).map((uniform) => (
          <div key={uniform.name} className="flex items-center justify-between">
            <span className="text-[9px] text-gray-400">{uniform.name}</span>
            <span className="text-[9px] text-gray-500 font-mono">
              {Array.isArray(uniform.value)
                ? uniform.value.map((v) => typeof v === 'number' ? v.toFixed(1) : v).join(', ')
                : typeof uniform.value === 'number'
                ? uniform.value.toFixed(2)
                : String(uniform.value)}
            </span>
          </div>
        ))}
        {data.uniforms.length > 3 && (
          <div className="text-[9px] text-gray-600">
            +{data.uniforms.length - 3} more
          </div>
        )}
      </div>

      {/* Input handles */}
      {inputs.map((input, i) => (
        <Handle
          key={`input-${input}`}
          type="target"
          position={Position.Left}
          id={input}
          style={{
            top: `${30 + i * 20}%`,
            background: '#4a9eff',
            width: 8,
            height: 8,
            border: '2px solid #1e1e3a',
          }}
        />
      ))}

      {/* Output handles */}
      {outputs.map((output, i) => (
        <Handle
          key={`output-${output}`}
          type="source"
          position={Position.Right}
          id={output}
          style={{
            top: `${30 + i * 20}%`,
            background: '#ff6b6b',
            width: 8,
            height: 8,
            border: '2px solid #1e1e3a',
          }}
        />
      ))}
    </div>
  )
}

export default memo(ShaderNodeComponent)
