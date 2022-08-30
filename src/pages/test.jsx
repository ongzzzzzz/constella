import Head from "next/head"
import Link from "next/link"

import { useState, useEffect } from "react"

const Page = (props) => {
  let [scroll, setScroll] = useState(0);


  useEffect(() => {
    const scrollHandler = (e) => setScroll((scroll) => scroll + e.deltaY);
    window.addEventListener("wheel", scrollHandler);
    return () => window.removeEventListener("wheel", scrollHandler);
  }, []);

  return (
    <>
      <div>helo</div>
      <div>{scroll}</div>
    </>
  )
}


export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Test',
    },
  }
}
