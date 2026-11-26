import { useState, useRef, useCallback, useEffect } from 'react'

interface GlyphData {
  char: string
  paths: { x: number; y: number }[][]
  width: number
}

export default function FontCreator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentChar, setCurrentChar] = useState('A')
  const [glyphs, setGlyphs] = useState<Map<string, GlyphData>>(new Map())
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
  const [allPaths, setAllPaths] = useState<{ x: number; y: number }[][]>([])
  const [tool, setTool] = useState<'draw' | 'erase' | 'move'>('draw')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [fontName, setFontName] = useState('MyCustomFont')
  const [previewText, setPreviewText] = useState('Hello World')
  const [gridSize, setGridSize] = useState(20)
  const [showGrid, setShowGrid] = useState(true)
  const [fontSize, setFontSize] = useState(100)

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&?.,'

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#1f2937'
      ctx.lineWidth = 0.5
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Draw baseline guides
    ctx.strokeStyle = '#e9456033'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    // Baseline
    ctx.beginPath()
    ctx.moveTo(0, canvas.height * 0.75)
    ctx.lineTo(canvas.width, canvas.height * 0.75)
    ctx.stroke()
    // Cap height
    ctx.beginPath()
    ctx.moveTo(0, canvas.height * 0.2)
    ctx.lineTo(canvas.width, canvas.height * 0.2)
    ctx.stroke()
    // x-height
    ctx.strokeStyle = '#4a9eff33'
    ctx.beginPath()
    ctx.moveTo(0, canvas.height * 0.45)
    ctx.lineTo(canvas.width, canvas.height * 0.45)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw existing paths
    ctx.strokeStyle = '#eaeaea'
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const path of allPaths) {
      if (path.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y)
      }
      ctx.stroke()
    }

    // Draw current path
    if (currentPath.length > 1) {
      ctx.strokeStyle = '#e94560'
      ctx.beginPath()
      ctx.moveTo(currentPath[0].x, currentPath[0].y)
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y)
      }
      ctx.stroke()
    }
  }, [allPaths, currentPath, showGrid, gridSize, strokeWidth])

  const getCanvasPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool !== 'draw') return
    setIsDrawing(true)
    const pos = getCanvasPos(e)
    setCurrentPath([pos])
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || tool !== 'draw') return
    const pos = getCanvasPos(e)
    setCurrentPath((prev) => [...prev, pos])
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentPath.length > 1) {
      setAllPaths((prev) => [...prev, currentPath])
    }
    setCurrentPath([])
  }

  const saveGlyph = () => {
    const glyph: GlyphData = {
      char: currentChar,
      paths: allPaths,
      width: fontSize,
    }
    setGlyphs((prev) => new Map(prev).set(currentChar, glyph))
  }

  const loadGlyph = (char: string) => {
    setCurrentChar(char)
    const glyph = glyphs.get(char)
    if (glyph) {
      setAllPaths(glyph.paths)
    } else {
      setAllPaths([])
    }
    setCurrentPath([])
  }

  const clearCanvas = () => {
    setAllPaths([])
    setCurrentPath([])
  }

  const undoLast = () => {
    setAllPaths((prev) => prev.slice(0, -1))
  }

  const exportFont = () => {
    // Export as SVG font
    let svgContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg">
<defs>
<font id="${fontName}" horiz-adv-x="${fontSize}">
  <font-face font-family="${fontName}" units-per-em="${fontSize}" ascent="${fontSize * 0.8}" descent="${fontSize * 0.2}"/>
  <missing-glyph horiz-adv-x="${fontSize / 2}"/>
`

    glyphs.forEach((glyph) => {
      let pathData = ''
      for (const path of glyph.paths) {
        if (path.length < 2) continue
        pathData += `M${path[0].x.toFixed(1)} ${path[0].y.toFixed(1)} `
        for (let i = 1; i < path.length; i++) {
          pathData += `L${path[i].x.toFixed(1)} ${path[i].y.toFixed(1)} `
        }
      }
      svgContent += `  <glyph unicode="${glyph.char}" horiz-adv-x="${glyph.width}" d="${pathData}"/>\n`
    })

    svgContent += `</font>
</defs>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fontName}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex">
      {/* Character selector */}
      <div className="w-48 bg-editor-panel border-r border-editor-accent flex flex-col overflow-hidden">
        <div className="p-3 border-b border-editor-accent">
          <input
            type="text"
            value={fontName}
            onChange={(e) => setFontName(e.target.value)}
            placeholder="Font name"
            className="w-full px-2 py-1 bg-editor-bg border border-editor-accent rounded text-xs text-editor-text"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-5 gap-1">
            {characters.split('').map((char) => (
              <button
                key={char}
                onClick={() => loadGlyph(char)}
                className={`w-8 h-8 flex items-center justify-center text-xs rounded transition-colors ${
                  currentChar === char
                    ? 'bg-editor-highlight text-white'
                    : glyphs.has(char)
                    ? 'bg-editor-accent text-white'
                    : 'bg-editor-bg text-gray-400 hover:bg-editor-accent'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 border-t border-editor-accent space-y-2">
          <div className="text-[10px] text-gray-400">
            {glyphs.size} glyphs created
          </div>
          <button
            onClick={exportFont}
            className="w-full px-3 py-1.5 text-xs bg-editor-highlight hover:bg-red-600 rounded transition-colors"
          >
            Export SVG Font
          </button>
        </div>
      </div>

      {/* Drawing area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-10 bg-editor-panel border-b border-editor-accent flex items-center px-3 gap-3">
          <div className="flex gap-1">
            {(['draw', 'erase', 'move'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTool(t)}
                className={`px-2 py-1 text-[10px] rounded ${
                  tool === t ? 'bg-editor-highlight text-white' : 'bg-editor-bg text-gray-400'
                }`}
              >
                {t === 'draw' ? '✏️' : t === 'erase' ? '🧹' : '✋'} {t}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-editor-accent" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Size:</span>
            <input
              type="range"
              min={1}
              max={20}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="h-4 w-px bg-editor-accent" />
          <button
            onClick={undoLast}
            className="px-2 py-1 text-[10px] bg-editor-bg text-gray-400 hover:text-white rounded"
          >
            Undo
          </button>
          <button
            onClick={clearCanvas}
            className="px-2 py-1 text-[10px] bg-editor-bg text-gray-400 hover:text-white rounded"
          >
            Clear
          </button>
          <button
            onClick={saveGlyph}
            className="px-2 py-1 text-[10px] bg-editor-accent text-white rounded"
          >
            Save '{currentChar}'
          </button>
          <label className="flex items-center gap-1 text-[10px] text-gray-400 ml-auto">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="w-3 h-3"
            />
            Grid
          </label>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-editor-bg p-4">
          <div className="relative">
            <div className="absolute -top-6 left-0 text-xs text-gray-500">
              Editing: <span className="text-editor-highlight font-bold text-lg">{currentChar}</span>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border border-editor-accent rounded-lg cursor-crosshair bg-[#0d0d1a]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="h-24 bg-editor-panel border-t border-editor-accent p-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] text-gray-400">Preview:</span>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="flex-1 px-2 py-1 bg-editor-bg border border-editor-accent rounded text-xs text-editor-text"
            />
          </div>
          <div className="text-2xl text-editor-text font-bold tracking-wider overflow-hidden">
            {previewText.split('').map((char, i) => (
              <span
                key={i}
                className={glyphs.has(char) ? 'text-editor-highlight' : 'text-gray-600'}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
