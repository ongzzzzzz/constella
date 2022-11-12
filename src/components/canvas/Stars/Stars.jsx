import useStore, { setState } from '@/helpers/store'
import { lerp, hexToRgb } from '@/helpers/meth'
import { PointsBuffer } from '@react-three/drei'
import * as THREE from "three";
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { useRef, useState, useMemo } from 'react'

import vertex from './glsl/shader.vert'
import fragment from './glsl/shader.frag'



let R = 1000;
let pointer = new THREE.Vector2(0, 0);
const StarsComponent = (props) => {
  const points = useRef(null)
  
  const [hovered, setHover] = useState(false);

  let [stars, setStars] = useState(JSON.parse(JSON.stringify(props.stars)));

  let count = stars.length;
  
  let positions = useMemo(() => {
    let positions = [];
    stars.forEach(star => {
      // spherical to cartesian
      positions.push(
        R * Math.cos(star.dec) * Math.cos(star.ra),
        R * Math.sin(star.dec),
        -R * Math.cos(star.dec) * Math.sin(star.ra)
      )
    });
    return new Float32Array(positions);
  }, [count, 3]);
  // console.log(positions)

  let sizes = useMemo(() => {
    let sizes = [];
    stars.forEach(star => {
      sizes.push( lerp(star.mag, -1.5, 6, 50, 2) )
    });
    return new Float32Array(sizes);
  }, [count, 1]);

  let [currStar, setCurrStar] = useState(-1);
  let customColors = useMemo(() => {
    let customColors = [];
    stars.forEach(star => {
      let clr = hexToRgb(star.rgbcolor);
      customColors.push(clr.r, clr.g, clr.b)
    });
    return new Float32Array(customColors);
  }, [stars, 3]);


  let [updateClr, setUpdateClr] = useState(false);
  useFrame((state, delta) => {
    // mesh.current ? (mesh.current.rotation.y = mesh.current.rotation.x += 0.01) : null

    if (state.mouse) pointer.x = state.mouse.x, pointer.y = state.mouse.y;

    state.raycaster.setFromCamera(pointer, state.camera);
    let intersects = state.raycaster.intersectObject(points.current);
    

    if (intersects.length > 0) {
      let currIdx = intersects[0].index;

      // TODO: fix initial bug when hovering over star
      if (currIdx != currStar) {
        setStars(currStars => {
          let newStars = [...currStars];
          newStars[currIdx].rgbcolor = "#ff0000";
          if (currStar != -1) 
            newStars[currStar].rgbcolor = props.stars[currStar].rgbcolor;
          return newStars;
        });
        // console.log(currStar, currIdx)
        setCurrStar(currIdx);
        setState(prevState => ({ ...prevState, pointing: currIdx }));
        setUpdateClr(true);
      }
      else {
        setUpdateClr(false);
      }
    }
    else {
      if (currStar !== -1) {
        setStars(currStars => {
          let newStars = [...currStars];
          newStars[currStar].rgbcolor = props.stars[currStar].rgbcolor;
          return newStars;
        });
        // console.log(currStar, -1)
        setCurrStar(-1);
        setState(prevState => ({ ...prevState, pointing: -1 }));
        setUpdateClr(true);
      }
      else {
        setUpdateClr(false);
      }
    }
  })

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
            needsUpdate={updateClr}
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
