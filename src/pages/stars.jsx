import dynamic from 'next/dynamic'
import { lerp } from '@/helpers/meth'

import useStore from '@/helpers/store'

const Stars = dynamic(() => import('@/components/canvas/Stars/Stars'), {
    ssr: false,
})

const Page = (props) => {
    const fov = useStore((state) => state.fov);
    const pointing = useStore((state) => state.pointing);
    return (
        <div>
            <div style={{color: "white"}}>FOV: {fov}</div>
            <div style={{color: "white"}}>pointing: {pointing}</div>
        </div>
    )
}

Page.r3f = (props) => {

    return (<>
        <Stars stars={props.stars} />
    </>)
}

export default Page

export async function getStaticProps() {
    // let f = await fetch("https://firebasestorage.googleapis.com/v0/b/constella-e819c.appspot.com/o/starsv1.json?alt=media&token=6a12294b-ae32-46bc-86f6-fa6248ce6dc2");
    // let f = await fetch("assets/starsv1.json");
    // let { stars } = await f.json();

    let { stars } = require("../../public/assets/starsv1.json");

    // console.log(stars)
    return {
        props: {
            title: "stars",
            stars
        },
    }
}
