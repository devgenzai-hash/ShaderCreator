import { useState } from 'react'
import { shaderPresets, type ShaderPreset } from '../engine/presets'

interface PresetsPanelProps {
  onClose: () => void
  onLoadPreset: (preset: ShaderPreset) => void
}

export default function PresetsPanel({ onClose, onLoadPreset }: PresetsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(shaderPresets.map((p) => p.category))]
  const filtered = selectedCategory
    ? shaderPresets.filter((p) => p.category === selectedCategory)
    : shaderPresets

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[80vh] bg-editor-panel border border-editor-accent rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-editor-accent flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-editor-text">Shader Presets</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ready-made shader node trees. Click to load into the editor.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Category filter */}
        <div className="px-5 py-3 border-b border-editor-accent flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-[11px] rounded-full transition-colors ${
              selectedCategory === null
                ? 'bg-editor-highlight text-white'
                : 'bg-editor-accent text-gray-300 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-[11px] rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-editor-highlight text-white'
                  : 'bg-editor-accent text-gray-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Presets grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onLoadPreset(preset)
                  onClose()
                }}
                className="text-left bg-editor-bg border border-editor-accent rounded-lg p-4 hover:border-editor-highlight transition-all hover:shadow-lg hover:shadow-editor-highlight/10 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{preset.thumbnail}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-editor-text group-hover:text-editor-highlight transition-colors">
                      {preset.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {preset.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {preset.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="bg-editor-accent px-2 py-0.5 rounded">
                    {preset.nodes.length} nodes
                  </span>
                  <span className="bg-editor-accent px-2 py-0.5 rounded">
                    {preset.edges.length} connections
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
