import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import CameraUpdate from '../canvas/CameraUpdate'

const LControl = () => {
  const dom = useStore((state) => state.dom)
  const fov = useStore((state) => state.fov)
  const control = useRef(null)

  useEffect(() => {
    if (control.current) {
      const domElement = dom.current
      const originalTouchAction = domElement.style['touch-action'] 
      domElement.style['touch-action'] = 'none'

      return () => {
        domElement.style['touch-action'] = originalTouchAction
      }
    }
  }, [dom, control])
  // @ts-ignore
  return <OrbitControls ref={control} domElement={dom.current} maxDistance={0.001} rotateSpeed={-0.25*(fov/50)}/>
}

const LCanvas = ({ children }) => {
  let dom = useStore((state) => state.dom);
  let fov = useStore((state) => state.fov);

  return (
    <Canvas
      mode='concurrent'
      style={{
        position: 'absolute',
        top: 0,
      }}
      onCreated={(state) => state.events.connect(dom.current)}
    >
      <color attach="background" args={["black"]}/>
      {/* <axesHelper args={[5,5,5]} /> */}
      <CameraUpdate />
      <LControl />
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
