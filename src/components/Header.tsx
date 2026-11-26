import { useShaderStore, ActiveTool } from '../store/shaderStore'

export default function Header() {
  const { activeTool, setActiveTool } = useShaderStore()

  const tools: { id: ActiveTool; label: string; icon: string }[] = [
    { id: 'shader', label: 'Shader Builder', icon: '◆' },
    { id: 'font', label: 'Font Creator', icon: 'Aa' },
    { id: 'video-effects', label: 'Video Effects', icon: '▶' },
  ]

  return (
    <header className="h-12 bg-editor-panel border-b border-editor-accent flex items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-gradient-to-br from-editor-highlight to-editor-accent flex items-center justify-center text-xs font-bold">
          SS
        </div>
        <span className="text-sm font-semibold text-editor-text">ShaderShade</span>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex bg-editor-bg rounded-lg p-0.5 gap-0.5">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTool === tool.id
                  ? 'bg-editor-highlight text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-editor-accent/50'
              }`}
            >
              <span className="mr-1.5">{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-xs bg-editor-accent hover:bg-editor-highlight rounded-md transition-colors">
          Export
        </button>
        <button className="px-3 py-1.5 text-xs bg-editor-highlight hover:bg-red-600 rounded-md transition-colors font-medium">
          Share
        </button>
      </div>
    </header>
  )
}
