import { useState } from 'react'
import { useShaderStore } from './store/shaderStore'
import ShaderEditor from './components/ShaderEditor'
import FontCreator from './components/FontCreator'
import VideoEffects from './components/VideoEffects'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function App() {
  const { activeTool } = useShaderStore()

  return (
    <div className="h-screen flex flex-col bg-[#0a0a1a]">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {activeTool === 'shader' && <ShaderEditor />}
          {activeTool === 'font' && <FontCreator />}
          {activeTool === 'video-effects' && <VideoEffects />}
        </main>
      </div>
    </div>
  )
}
