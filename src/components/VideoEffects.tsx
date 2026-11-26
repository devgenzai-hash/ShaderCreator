import { useState, useRef, useEffect, useCallback } from 'react'

interface VideoEffect {
  id: string
  name: string
  type: string
  params: Record<string, number>
  enabled: boolean
}

const effectPresets: {
  name: string
  type: string
  params: Record<string, number>
  description: string
}[] = [
  {
    name: 'Chromatic Aberration',
    type: 'chromatic',
    params: { intensity: 0.005, angle: 0 },
    description: 'RGB channel separation for a glitch look',
  },
  {
    name: 'Glitch',
    type: 'glitch',
    params: { intensity: 0.5, frequency: 5, blockSize: 10 },
    description: 'Digital glitch with block displacement',
  },
  {
    name: 'VHS',
    type: 'vhs',
    params: { scanlineIntensity: 0.3, noiseIntensity: 0.1, distortion: 0.02 },
    description: 'Retro VHS tape effect with scanlines',
  },
  {
    name: 'Pixelate',
    type: 'pixelate',
    params: { size: 8 },
    description: 'Mosaic pixelation effect',
  },
  {
    name: 'Color Grading',
    type: 'colorGrade',
    params: { brightness: 1, contrast: 1, saturation: 1, hue: 0, temperature: 0 },
    description: 'Professional color correction',
  },
  {
    name: 'Film Grain',
    type: 'grain',
    params: { intensity: 0.3, size: 1.5, speed: 10 },
    description: 'Cinematic film grain texture',
  },
  {
    name: 'Bloom/Glow',
    type: 'bloom',
    params: { threshold: 0.6, intensity: 1.5, radius: 4 },
    description: 'Light bloom and glow effect',
  },
  {
    name: 'Motion Blur',
    type: 'motionBlur',
    params: { angle: 0, radius: 5, samples: 8 },
    description: 'Directional motion blur',
  },
  {
    name: 'Kaleidoscope',
    type: 'kaleidoscope',
    params: { segments: 6, rotation: 0 },
    description: 'Mirror symmetry kaleidoscope',
  },
  {
    name: 'Wave Distortion',
    type: 'wave',
    params: { amplitudeX: 0.02, amplitudeY: 0.02, frequencyX: 10, frequencyY: 10, speed: 2 },
    description: 'Animated wave distortion',
  },
  {
    name: 'Vignette',
    type: 'vignette',
    params: { intensity: 0.5, radius: 0.8, softness: 0.5 },
    description: 'Dark edge vignette',
  },
  {
    name: 'Halftone',
    type: 'halftone',
    params: { scale: 4, angle: 0.5 },
    description: 'Comic book halftone dots',
  },
  {
    name: 'Edge Detection',
    type: 'edge',
    params: { threshold: 0.1, color: 1 },
    description: 'Sobel edge detection outline',
  },
  {
    name: 'Displacement Map',
    type: 'displacement',
    params: { scale: 0.1, speed: 1 },
    description: 'Noise-based displacement distortion',
  },
  {
    name: 'RGB Split',
    type: 'rgbSplit',
    params: { offsetX: 5, offsetY: 2, animate: 1 },
    description: 'Separate RGB channels with offset',
  },
  {
    name: 'Duotone',
    type: 'duotone',
    params: { darkR: 0.1, darkG: 0, darkB: 0.3, lightR: 1, lightG: 0.8, lightB: 0.2 },
    description: 'Two-tone color mapping',
  },
]

export default function VideoEffects() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [effects, setEffects] = useState<VideoEffect[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const animRef = useRef<number>(0)
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null)

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('video/')) return
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('video/')) return
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
  }

  const addEffect = (preset: typeof effectPresets[0]) => {
    const effect: VideoEffect = {
      id: `effect_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: preset.name,
      type: preset.type,
      params: { ...preset.params },
      enabled: true,
    }
    setEffects((prev) => [...prev, effect])
    setSelectedEffect(effect.id)
  }

  const removeEffect = (id: string) => {
    setEffects((prev) => prev.filter((e) => e.id !== id))
    if (selectedEffect === id) setSelectedEffect(null)
  }

  const toggleEffect = (id: string) => {
    setEffects((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    )
  }

  const updateEffectParam = (effectId: string, param: string, value: number) => {
    setEffects((prev) =>
      prev.map((e) =>
        e.id === effectId ? { ...e, params: { ...e.params, [param]: value } } : e
      )
    )
  }

  const reorderEffects = (fromIndex: number, toIndex: number) => {
    setEffects((prev) => {
      const newEffects = [...prev]
      const [moved] = newEffects.splice(fromIndex, 1)
      newEffects.splice(toIndex, 0, moved)
      return newEffects
    })
  }

  // Apply effects to canvas
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !videoSrc) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = () => {
      if (video.paused || video.ended) return

      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Apply effects
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (const effect of effects) {
        if (!effect.enabled) continue
        applyEffect(data, canvas.width, canvas.height, effect)
      }

      ctx.putImageData(imageData, 0, 0)
      animRef.current = requestAnimationFrame(renderFrame)
    }

    video.addEventListener('play', () => {
      setIsPlaying(true)
      renderFrame()
    })
    video.addEventListener('pause', () => setIsPlaying(false))
    video.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [videoSrc, effects])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const exportVideo = () => {
    // Generate shader code for the effect stack
    const shaderCode = generateVideoEffectShader(effects)
    const blob = new Blob([shaderCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'video-effects-shader.glsl'
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentEffect = effects.find((e) => e.id === selectedEffect)

  return (
    <div className="h-full flex">
      {/* Effect Library */}
      <div className="w-56 bg-editor-panel border-r border-editor-accent flex flex-col overflow-hidden">
        <div className="p-3 border-b border-editor-accent">
          <h3 className="text-xs font-semibold text-editor-text">Effect Library</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {effectPresets.map((preset) => (
            <button
              key={preset.type}
              onClick={() => addEffect(preset)}
              className="w-full text-left p-2 rounded-md hover:bg-editor-accent/50 transition-colors group"
            >
              <div className="text-[11px] font-medium text-gray-300 group-hover:text-white">
                {preset.name}
              </div>
              <div className="text-[9px] text-gray-500">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Video preview */}
        <div className="flex-1 flex items-center justify-center bg-editor-bg p-4 relative">
          {videoSrc ? (
            <div className="relative max-w-full max-h-full">
              <video
                ref={videoRef}
                src={videoSrc}
                className="hidden"
                loop
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg shadow-xl"
                style={{ maxHeight: '60vh' }}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={togglePlayPause}
                  className="px-4 py-2 bg-editor-panel/80 backdrop-blur-sm rounded-full text-xs hover:bg-editor-highlight transition-colors"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
              </div>
            </div>
          ) : (
            <div
              className="drop-zone w-full max-w-lg h-64 flex flex-col items-center justify-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-3 opacity-30">🎬</div>
              <h3 className="text-sm text-gray-400 mb-2">Upload a Video</h3>
              <p className="text-[10px] text-gray-600 mb-3">
                Drop a video file or click to browse
              </p>
              <label className="px-4 py-2 text-xs bg-editor-highlight hover:bg-red-600 rounded-md cursor-pointer transition-colors">
                Choose Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Effect stack + properties */}
        <div className="h-48 flex border-t border-editor-accent">
          {/* Active effects stack */}
          <div className="w-64 bg-editor-panel border-r border-editor-accent flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-editor-accent">
              <span className="text-[10px] font-semibold text-gray-300">Effect Stack</span>
              <button
                onClick={exportVideo}
                className="px-2 py-0.5 text-[9px] bg-editor-highlight rounded"
              >
                Export
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
              {effects.map((effect, index) => (
                <div
                  key={effect.id}
                  onClick={() => setSelectedEffect(effect.id)}
                  className={`flex items-center gap-2 p-1.5 rounded text-[10px] cursor-pointer transition-colors ${
                    selectedEffect === effect.id
                      ? 'bg-editor-accent'
                      : 'hover:bg-editor-accent/30'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleEffect(effect.id)
                    }}
                    className={`w-3 h-3 rounded-sm border ${
                      effect.enabled
                        ? 'bg-editor-highlight border-editor-highlight'
                        : 'border-gray-500'
                    }`}
                  />
                  <span className={effect.enabled ? 'text-gray-200' : 'text-gray-500'}>
                    {effect.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeEffect(effect.id)
                    }}
                    className="ml-auto text-gray-600 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
              {effects.length === 0 && (
                <p className="text-[10px] text-gray-600 text-center py-3">
                  Add effects from the library
                </p>
              )}
            </div>
          </div>

          {/* Effect properties */}
          <div className="flex-1 bg-editor-panel overflow-y-auto p-3">
            {currentEffect ? (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-editor-text">
                  {currentEffect.name}
                </h4>
                {Object.entries(currentEffect.params).map(([param, value]) => (
                  <div key={param}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-gray-400">{param}</label>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {value.toFixed(3)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={param.includes('ntensity') || param.includes('brightness') ? 3 : param.includes('ize') || param.includes('radius') || param.includes('segments') ? 20 : param.includes('frequency') || param.includes('speed') ? 20 : 1}
                      step={0.001}
                      value={value}
                      onChange={(e) =>
                        updateEffectParam(currentEffect.id, param, parseFloat(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 text-center py-4">
                Select an effect to edit parameters
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Apply pixel-level effects
function applyEffect(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  effect: VideoEffect
) {
  const { type, params } = effect
  const time = Date.now() / 1000

  switch (type) {
    case 'colorGrade': {
      const { brightness, contrast, saturation } = params
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i] / 255
        let g = data[i + 1] / 255
        let b = data[i + 2] / 255

        // Brightness
        r *= brightness
        g *= brightness
        b *= brightness

        // Contrast
        r = (r - 0.5) * contrast + 0.5
        g = (g - 0.5) * contrast + 0.5
        b = (b - 0.5) * contrast + 0.5

        // Saturation
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
        r = gray + (r - gray) * saturation
        g = gray + (g - gray) * saturation
        b = gray + (b - gray) * saturation

        data[i] = Math.max(0, Math.min(255, r * 255))
        data[i + 1] = Math.max(0, Math.min(255, g * 255))
        data[i + 2] = Math.max(0, Math.min(255, b * 255))
      }
      break
    }
    case 'grain': {
      const { intensity } = params
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity * 255
        data[i] = Math.max(0, Math.min(255, data[i] + noise))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
      }
      break
    }
    case 'vignette': {
      const { intensity: vIntensity, radius, softness } = params
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4
          const dx = (x / width - 0.5) * 2
          const dy = (y / height - 0.5) * 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          const vig = 1 - smoothstep(radius - softness, radius + softness, dist) * vIntensity
          data[i] *= vig
          data[i + 1] *= vig
          data[i + 2] *= vig
        }
      }
      break
    }
    case 'pixelate': {
      const size = Math.max(1, Math.round(params.size))
      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          const i = (y * width + x) * 4
          const r = data[i], g = data[i + 1], b = data[i + 2]
          for (let dy = 0; dy < size && y + dy < height; dy++) {
            for (let dx = 0; dx < size && x + dx < width; dx++) {
              const j = ((y + dy) * width + (x + dx)) * 4
              data[j] = r
              data[j + 1] = g
              data[j + 2] = b
            }
          }
        }
      }
      break
    }
    case 'duotone': {
      const { darkR, darkG, darkB, lightR, lightG, lightB } = params
      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255
        data[i] = Math.round((darkR + (lightR - darkR) * gray) * 255)
        data[i + 1] = Math.round((darkG + (lightG - darkG) * gray) * 255)
        data[i + 2] = Math.round((darkB + (lightB - darkB) * gray) * 255)
      }
      break
    }
  }
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function generateVideoEffectShader(effects: VideoEffect[]): string {
  let code = `precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

`

  // Add effect functions
  code += `// Helper functions
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

`

  code += `void main() {
  vec2 uv = vUv;
  vec4 color = texture2D(u_texture, uv);
  
`

  for (const effect of effects) {
    if (!effect.enabled) continue

    switch (effect.type) {
      case 'chromatic':
        code += `  // Chromatic Aberration
  float chromOffset = ${effect.params.intensity.toFixed(4)};
  color.r = texture2D(u_texture, uv + vec2(chromOffset, 0.0)).r;
  color.b = texture2D(u_texture, uv - vec2(chromOffset, 0.0)).b;
  
`
        break
      case 'vignette':
        code += `  // Vignette
  float vigDist = length(uv - 0.5) * 2.0;
  float vig = 1.0 - smoothstep(${effect.params.radius.toFixed(3)}, ${(effect.params.radius + effect.params.softness).toFixed(3)}, vigDist) * ${effect.params.intensity.toFixed(3)};
  color.rgb *= vig;
  
`
        break
      case 'colorGrade':
        code += `  // Color Grading
  color.rgb *= ${effect.params.brightness.toFixed(3)};
  color.rgb = (color.rgb - 0.5) * ${effect.params.contrast.toFixed(3)} + 0.5;
  float gray = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  color.rgb = mix(vec3(gray), color.rgb, ${effect.params.saturation.toFixed(3)});
  
`
        break
      case 'grain':
        code += `  // Film Grain
  float grain = (hash(uv + fract(u_time)) - 0.5) * ${effect.params.intensity.toFixed(3)};
  color.rgb += grain;
  
`
        break
      case 'pixelate':
        code += `  // Pixelate
  float pixelSize = ${effect.params.size.toFixed(1)} / u_resolution.x;
  vec2 pixUv = floor(uv / pixelSize) * pixelSize;
  color = texture2D(u_texture, pixUv);
  
`
        break
    }
  }

  code += `  gl_FragColor = color;
}
`

  return code
}
