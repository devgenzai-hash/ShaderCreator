import { useRef, useEffect, useState } from 'react'
import { useShaderStore } from '../store/shaderStore'

export default function ShaderPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { fragmentShader, vertexShader, previewMode } = useShaderStore()
  const [error, setError] = useState<string | null>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) {
      setError('WebGL not supported')
      return
    }

    // Vertex shader
    const vsSource = `
      attribute vec4 a_position;
      attribute vec2 a_texcoord;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vUv = a_texcoord;
        vPosition = a_position.xyz;
        vNormal = vec3(0.0, 0.0, 1.0);
        gl_Position = a_position;
      }
    `

    // Use the generated fragment shader or default
    let fsSource = fragmentShader
    if (!fsSource || fsSource.trim().length === 0) {
      fsSource = `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        varying vec2 vUv;
        void main() {
          vec2 st = vUv;
          vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
          gl_FragColor = vec4(color, 1.0);
        }
      `
    }

    // Add precision if not present
    if (!fsSource.includes('precision')) {
      fsSource = 'precision mediump float;\n' + fsSource
    }

    // Compile shaders
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)

    if (!vs || !fs) {
      setError('Shader compilation failed')
      return
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setError('Shader link failed: ' + gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return
    }

    setError(null)

    // Create quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ])
    const texcoords = new Float32Array([
      0, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 1,
    ])

    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const texBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(program, 'a_position')
    const texLoc = gl.getAttribLocation(program, 'a_texcoord')
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse')

    function render() {
      if (!canvas || !gl) return

      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)

      // Set uniforms
      const time = (Date.now() - startTimeRef.current) / 1000
      if (timeLoc) gl.uniform1f(timeLoc, time)
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height)
      if (mouseLoc) gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y)

      // Bind position
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      // Bind texcoord
      if (texLoc >= 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
        gl.enableVertexAttribArray(texLoc)
        gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0)
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animRef.current)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(posBuffer)
      gl.deleteBuffer(texBuffer)
    }
  }, [fragmentShader])

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    }
  }

  return (
    <div className="h-full relative bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
      />
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-900/90 text-red-200 text-[10px] p-2 font-mono">
          {error}
        </div>
      )}
      <div className="absolute top-2 left-2 text-[10px] text-gray-500 bg-black/50 px-2 py-0.5 rounded">
        Live Preview
      </div>
    </div>
  )
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}
