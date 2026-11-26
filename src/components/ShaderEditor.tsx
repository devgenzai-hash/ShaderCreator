import { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  MiniMap,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useShaderStore } from '../store/shaderStore'
import { nodeTemplates, createShaderNode, generateShaderCode } from '../engine/shaderNodes'
import ShaderNodeComponent from './nodes/ShaderNodeComponent'
import ShaderPreview from './ShaderPreview'
import PropertiesPanel from './PropertiesPanel'
import CodePanel from './CodePanel'
import PresetsPanel from './PresetsPanel'
import DocsPanel from './DocsPanel'
import { type ShaderPreset } from '../engine/presets'

const nodeTypes = {
  shaderNode: ShaderNodeComponent,
}

export default function ShaderEditor() {
  const { setNodes: setStoreNodes, setEdges: setStoreEdges, setFragmentShader } = useShaderStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showCode, setShowCode] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [showPresets, setShowPresets] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(
        {
          ...params,
          animated: true,
          style: { stroke: '#e94560', strokeWidth: 2 },
        },
        edges
      )
      setEdges(newEdges)
      setStoreEdges(newEdges)
      // Regenerate shader
      const code = generateShaderCode(nodes, newEdges)
      setFragmentShader(code)
    },
    [edges, nodes, setEdges, setStoreEdges, setFragmentShader]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/shadernode')
      if (!type || !reactFlowInstance) return

      const template = nodeTemplates.find((t) => t.type === type)
      if (!template) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = createShaderNode(template, position)
      const updatedNodes = [...nodes, newNode]
      setNodes(updatedNodes)
      setStoreNodes(updatedNodes)

      // Regenerate shader
      const code = generateShaderCode(updatedNodes, edges)
      setFragmentShader(code)
    },
    [reactFlowInstance, nodes, edges, setNodes, setStoreNodes, setFragmentShader]
  )

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onNodeDataChange = useCallback(
    (nodeId: string, data: any) => {
      const updatedNodes = nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      )
      setNodes(updatedNodes)
      setStoreNodes(updatedNodes)
      const code = generateShaderCode(updatedNodes, edges)
      setFragmentShader(code)
    },
    [nodes, edges, setNodes, setStoreNodes, setFragmentShader]
  )

  const loadPreset = useCallback(
    (preset: ShaderPreset) => {
      setNodes(preset.nodes as Node[])
      setEdges(preset.edges)
      setStoreNodes(preset.nodes as Node[])
      setStoreEdges(preset.edges)
      const code = generateShaderCode(preset.nodes as Node[], preset.edges)
      setFragmentShader(code)
    },
    [setNodes, setEdges, setStoreNodes, setStoreEdges, setFragmentShader]
  )

  return (
    <div className="h-full flex">
      {/* Node Editor */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-editor-bg"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#1f2937"
          />
          <Controls className="!bg-editor-panel !border-editor-accent !rounded-lg" />
          <MiniMap
            className="!bg-editor-panel !border-editor-accent !rounded-lg"
            nodeColor={(node) => {
              const template = nodeTemplates.find((t) => t.type === node.data?.type)
              return template?.color || '#666'
            }}
          />
          <Panel position="top-right" className="flex gap-2">
            <button
              onClick={() => setShowPresets(true)}
              className="px-3 py-1.5 text-xs rounded-md bg-editor-panel text-gray-400 hover:text-white hover:bg-editor-accent transition-colors"
            >
              Presets
            </button>
            <button
              onClick={() => setShowDocs(true)}
              className="px-3 py-1.5 text-xs rounded-md bg-editor-panel text-gray-400 hover:text-white hover:bg-editor-accent transition-colors"
            >
              Docs
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                showPreview
                  ? 'bg-editor-highlight text-white'
                  : 'bg-editor-panel text-gray-400 hover:text-white'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                showCode
                  ? 'bg-editor-highlight text-white'
                  : 'bg-editor-panel text-gray-400 hover:text-white'
              }`}
            >
              Code
            </button>
          </Panel>
        </ReactFlow>

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">◆</div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                Start Building Your Shader
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                Drag nodes from the sidebar to create your shader. Connect outputs to inputs
                to build the shader pipeline.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-80 flex flex-col border-l border-editor-accent overflow-hidden">
        {/* Preview */}
        {showPreview && (
          <div className="h-64 border-b border-editor-accent flex-shrink-0">
            <ShaderPreview />
          </div>
        )}

        {/* Properties or Code */}
        <div className="flex-1 overflow-hidden">
          {showCode ? (
            <CodePanel />
          ) : (
            <PropertiesPanel
              selectedNode={selectedNode}
              onDataChange={onNodeDataChange}
            />
          )}
        </div>
      </div>

      {/* Presets Modal */}
      {showPresets && (
        <PresetsPanel onClose={() => setShowPresets(false)} onLoadPreset={loadPreset} />
      )}

      {/* Docs Panel */}
      {showDocs && <DocsPanel onClose={() => setShowDocs(false)} />}
    </div>
  )
}
