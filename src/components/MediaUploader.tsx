import { useCallback, useState } from 'react'
import { useShaderStore, MediaAsset } from '../store/shaderStore'

export default function MediaUploader() {
  const { mediaAssets, addMediaAsset, removeMediaAsset } = useShaderStore()
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      processFiles(files)
    },
    [addMediaAsset]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      processFiles(files)
    },
    [addMediaAsset]
  )

  const processFiles = (files: File[]) => {
    for (const file of files) {
      // Validate file type
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (!isImage && !isVideo) continue

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) continue

      const url = URL.createObjectURL(file)
      const asset: MediaAsset = {
        id: `media_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type: isImage ? 'image' : 'video',
        url,
      }
      addMediaAsset(asset)
    }
  }

  return (
    <div className="flex-1 flex flex-col p-3 overflow-hidden">
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`drop-zone p-4 text-center mb-3 ${dragOver ? 'drag-over' : ''}`}
      >
        <div className="text-2xl mb-2 opacity-40">📁</div>
        <p className="text-[10px] text-gray-400 mb-2">
          Drop images or videos here
        </p>
        <label className="inline-block px-3 py-1 text-[10px] bg-editor-accent hover:bg-editor-highlight rounded cursor-pointer transition-colors">
          Browse Files
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Asset list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {mediaAssets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center gap-2 p-2 bg-editor-bg rounded-md group"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/shadernode', asset.type === 'image' ? 'image' : 'video')
            }}
          >
            <div className="w-10 h-10 rounded overflow-hidden bg-editor-accent flex-shrink-0">
              {asset.type === 'image' ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={asset.url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-300 truncate">{asset.name}</p>
              <p className="text-[9px] text-gray-500">{asset.type}</p>
            </div>
            <button
              onClick={() => removeMediaAsset(asset.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs transition-opacity"
            >
              ×
            </button>
          </div>
        ))}

        {mediaAssets.length === 0 && (
          <p className="text-[10px] text-gray-600 text-center py-4">
            No media uploaded yet. Upload images or videos to use as shader textures.
          </p>
        )}
      </div>
    </div>
  )
}
