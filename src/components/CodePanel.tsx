import { useShaderStore } from '../store/shaderStore'
import { useState } from 'react'

export default function CodePanel() {
  const { fragmentShader, vertexShader, exportFormat, setExportFormat } = useShaderStore()
  const [activeTab, setActiveTab] = useState<'fragment' | 'vertex'>('fragment')
  const [copied, setCopied] = useState(false)

  const code = activeTab === 'fragment' ? fragmentShader : vertexShader

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    let exportCode = code
    let filename = 'shader'
    let ext = '.glsl'

    switch (exportFormat) {
      case 'three':
        exportCode = generateThreeJSCode(fragmentShader, vertexShader)
        ext = '.js'
        break
      case 'shadertoy':
        exportCode = convertToShadertoy(fragmentShader)
        ext = '.glsl'
        break
      case 'css':
        exportCode = generateCSSShader(fragmentShader)
        ext = '.css'
        break
    }

    const blob = new Blob([exportCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-editor-panel">
      {/* Tabs */}
      <div className="flex border-b border-editor-accent">
        <button
          onClick={() => setActiveTab('fragment')}
          className={`flex-1 px-3 py-2 text-xs transition-colors ${
            activeTab === 'fragment'
              ? 'bg-editor-accent text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Fragment
        </button>
        <button
          onClick={() => setActiveTab('vertex')}
          className={`flex-1 px-3 py-2 text-xs transition-colors ${
            activeTab === 'vertex'
              ? 'bg-editor-accent text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Vertex
        </button>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <pre className="p-3 text-[10px] leading-relaxed font-mono text-gray-300 whitespace-pre-wrap">
          {code}
        </pre>
      </div>

      {/* Export controls */}
      <div className="p-3 border-t border-editor-accent space-y-2">
        <div className="flex gap-1">
          {(['glsl', 'three', 'shadertoy', 'css'] as const).map((format) => (
            <button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`flex-1 px-2 py-1 text-[10px] rounded transition-colors ${
                exportFormat === format
                  ? 'bg-editor-highlight text-white'
                  : 'bg-editor-bg text-gray-400 hover:text-white'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 px-3 py-1.5 text-xs bg-editor-accent hover:bg-editor-highlight rounded transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy Code'}
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-3 py-1.5 text-xs bg-editor-highlight hover:bg-red-600 rounded transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

function generateThreeJSCode(fragment: string, vertex: string): string {
  return `import * as THREE from 'three';

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_mouse: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: \`${vertex}\`,
  fragmentShader: \`${fragment}\`,
});

// Usage with a mesh:
const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, shaderMaterial);
scene.add(mesh);

// Animation loop:
function animate() {
  requestAnimationFrame(animate);
  shaderMaterial.uniforms.u_time.value = performance.now() / 1000;
  renderer.render(scene, camera);
}
animate();

// Mouse tracking:
document.addEventListener('mousemove', (e) => {
  shaderMaterial.uniforms.u_mouse.value.set(
    e.clientX / window.innerWidth,
    1.0 - e.clientY / window.innerHeight
  );
});
`
}

function convertToShadertoy(fragment: string): string {
  let code = fragment
  code = code.replace(/uniform float u_time;/g, '')
  code = code.replace(/uniform vec2 u_resolution;/g, '')
  code = code.replace(/uniform vec2 u_mouse;/g, '')
  code = code.replace(/varying vec2 vUv;/g, '')
  code = code.replace(/vUv/g, 'fragCoord/iResolution.xy')
  code = code.replace(/u_time/g, 'iTime')
  code = code.replace(/u_resolution/g, 'iResolution.xy')
  code = code.replace(/u_mouse/g, 'iMouse.xy/iResolution.xy')
  code = code.replace(/void main\(\)/g, 'void mainImage(out vec4 fragColor, in vec2 fragCoord)')
  code = code.replace(/gl_FragColor/g, 'fragColor')
  return code
}

function generateCSSShader(_fragment: string): string {
  return `/* CSS Shader-like effect using CSS custom properties and animations */
.shader-element {
  --time: 0;
  background: linear-gradient(
    calc(var(--time) * 360deg),
    hsl(calc(var(--time) * 360), 70%, 50%),
    hsl(calc(var(--time) * 360 + 120), 70%, 50%),
    hsl(calc(var(--time) * 360 + 240), 70%, 50%)
  );
  animation: shader-anim 4s linear infinite;
}

@keyframes shader-anim {
  from { --time: 0; }
  to { --time: 1; }
}

@property --time {
  syntax: '<number>';
  initial-value: 0;
  inherits: false;
}

/* For full WebGL shader support, use the Three.js export */
`
}
