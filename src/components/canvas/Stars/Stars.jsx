import useStore from '@/helpers/store'
import { lerp, hexToRgb } from '@/helpers/meth'
import { PointsBuffer } from '@react-three/drei'
import * as THREE from "three";
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { useRef, useState, useMemo } from 'react'

import vertex from './glsl/shader.vert'
import fragment from './glsl/shader.frag'

let intersects = null;
let intersected = null;

let pointer = new THREE.Vector2(0, 0);
const StarsComponent = ({ stars }) => {
  const points = useRef(null)
  
  const [hovered, setHover] = useState(false);
  useFrame((state, delta) => {
    // mesh.current ? (mesh.current.rotation.y = mesh.current.rotation.x += 0.01) : null

    pointer.x = state.mouse.x, pointer.y = state.mouse.y;
    state.raycaster.setFromCamera(pointer, state.camera);
    intersects = state.raycaster.intersectObject(points.current);
    if (intersects.length > 0) {
      console.log(intersects[0])
    }
  })

  let R = 1000;

  let count = stars.length;
  let positionSep = 3;
  let positions = useMemo(() => {
    let positions = [];
    stars.forEach(star => {
      positions.push(
        R * Math.cos(star.dec) * Math.cos(star.ra),
        R * Math.sin(star.dec),
        -R * Math.cos(star.dec) * Math.sin(star.ra)
      )
    });
    return new Float32Array(positions);
  }, [count, positionSep]);
  // console.log(positions)

  let sizes = useMemo(() => {
    let sizes = [];
    stars.forEach(star => {
      sizes.push(
        lerp(star.mag, -1.5, 6, 50, 2)
      )
    });
    return new Float32Array(sizes);
  }, [count, 1]);

  let customColors = useMemo(() => {
    let customColors = [];
    stars.forEach(star => {
      let clr = hexToRgb(star.rgbcolor);
      customColors.push(clr.r, clr.g, clr.b)
    });
    return new Float32Array(customColors);
  }, [count, 3]);

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <points
        ref={points}
        onPointerOver={() => {setHover(true);}}
        onPointerOut={() => {setHover(false);}}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3} itemSize={3}
          />
          <bufferAttribute
            attach="attributes-customColor"
            array={customColors}
            count={customColors.length / 3} itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={sizes}
            count={sizes.length} itemSize={1}
          />
          
        </bufferGeometry>
        
        <shaderMaterial args={[{
          uniforms: {
						pointTexture: { value: new THREE.TextureLoader().load( 'assets/disc.png' ) },
						alphaTest: { value: 0.5 }
          },
          vertexShader: vertex,
          fragmentShader: fragment,
        }]}/>
      </points>
      <ambientLight />
    </>
  )
}
export default StarsComponent
