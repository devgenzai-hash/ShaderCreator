import { useState } from 'react'
import { useShaderStore } from '../store/shaderStore'
import { nodeTemplates, createShaderNode } from '../engine/shaderNodes'

export default function Sidebar() {
  const { activeTool, addNode } = useShaderStore()
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Input')
  const [searchQuery, setSearchQuery] = useState('')

  if (activeTool !== 'shader') return null

  const categories = [...new Set(nodeTemplates.map((t) => t.category))]

  const filteredTemplates = searchQuery
    ? nodeTemplates.filter(
        (t) =>
          t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nodeTemplates

  const handleDragStart = (e: React.DragEvent, templateType: string) => {
    e.dataTransfer.setData('application/shadernode', templateType)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-60 bg-editor-panel border-r border-editor-accent flex flex-col overflow-hidden">
      <div className="p-3 border-b border-editor-accent">
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 bg-editor-bg border border-editor-accent rounded-md text-xs text-editor-text placeholder-gray-500 focus:outline-none focus:border-editor-highlight"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => {
          const categoryTemplates = filteredTemplates.filter(
            (t) => t.category === category
          )
          if (categoryTemplates.length === 0) return null

          return (
            <div key={category} className="mb-2">
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category ? null : category
                  )
                }
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-gray-300 hover:text-white rounded transition-colors"
              >
                <span>{category}</span>
                <span className="text-[10px]">
                  {expandedCategory === category ? '▼' : '▶'}
                </span>
              </button>

              {(expandedCategory === category || searchQuery) && (
                <div className="space-y-1 mt-1">
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, template.type)}
                      className="flex items-center gap-2 px-2 py-2 rounded-md cursor-grab active:cursor-grabbing hover:bg-editor-accent/50 transition-colors group"
                    >
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: template.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-gray-300 group-hover:text-white truncate">
                          {template.label}
                        </div>
                        <div className="text-[9px] text-gray-500 truncate">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-editor-accent">
        <div className="text-[10px] text-gray-500 text-center">
          Drag nodes to canvas to build shader
        </div>
      </div>
    </aside>
  )
}
