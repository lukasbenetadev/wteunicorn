import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makeEmojiTexture(emoji) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)

  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.strokeStyle = 'rgba(242,216,189,0.95)'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.roundRect(30, 30, size - 60, size - 60, 72)
  ctx.fill()
  ctx.stroke()

  ctx.font = '260px system-ui, Apple Color Emoji, Segoe UI Emoji'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#111'
  ctx.fillText(emoji ?? '🍽️', size / 2, size / 2 + 10)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

function Dice({ phase, faceEmojis }) {
  const meshRef = useRef(null)
  const rollStartRef = useRef(0)

  const materials = useMemo(() => (
    new Array(6).fill(null).map((_, i) =>
      new THREE.MeshStandardMaterial({
        map: makeEmojiTexture(faceEmojis?.[i]),
        roughness: 0.3,
        metalness: 0.08,
      })
    )
  ), [faceEmojis])

  useEffect(() => {
    if (phase === 'rolling') rollStartRef.current = performance.now()
  }, [phase])

  useFrame((state, delta) => {
    const m = meshRef.current
    if (!m) return

    if (phase === 'idle') {
      m.rotation.x += ((-0.28) - m.rotation.x) * 0.04
      m.rotation.y += delta * 0.55
      m.position.set(0, Math.sin(state.clock.elapsedTime * 1.3) * 0.07, 0)
      m.scale.setScalar(1)
      return
    }

    if (phase === 'rolling') {
      const elapsed = (performance.now() - rollStartRef.current) / 1000
      const p = Math.min(1, elapsed / 2.3)
      const ease = p * p * p

      m.rotation.x += delta * 9.5
      m.rotation.y += delta * 13
      m.rotation.z += delta * 6.5

      m.position.set(0, -0.38 * ease, -2.4 * ease)
      m.scale.setScalar(Math.max(0.01, 1 - 0.99 * ease))
      return
    }

    m.position.set(0, -0.38, -2.4)
    m.scale.setScalar(0.01)
  })

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[0.88, 0.88, 0.88]} />
      {materials.map((mat, i) => (
        <primitive key={i} object={mat} attach={`material-${i}`} />
      ))}
    </mesh>
  )
}

export default function ThreeDiceStage({ phase, faceEmojis }) {
  return (
    <div className="three-stage" aria-hidden>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 2.4], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#1c0606']} />

        <ambientLight intensity={0.4} />
        <directionalLight
          intensity={1.5}
          position={[2, 4, 3]}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <pointLight intensity={0.6} position={[-2, 1, 2]} color="#ff8844" />

        <Dice phase={phase} faceEmojis={faceEmojis} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.92, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <shadowMaterial transparent opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  )
}
