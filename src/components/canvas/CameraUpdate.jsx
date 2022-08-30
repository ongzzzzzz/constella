import useStore, { setState } from '@/helpers/store'
import { lerp, constrain } from '@/helpers/meth'
import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react';

const CameraUpdate = () => {
    let fov = useStore((state) => state.fov);
    useEffect(() => {
        const scrollHandler = (e) =>
            setState((prevState) =>
                ({ fov: constrain(prevState.fov + e.deltaY * 0.03, 0.01, 180) })
            );
        window.addEventListener("wheel", scrollHandler);
        return () => window.removeEventListener("wheel", scrollHandler);
    }, []);

    useFrame((state, delta) => {
        state.camera.fov = fov;
        return null;
    });

    return null;
}
export default CameraUpdate