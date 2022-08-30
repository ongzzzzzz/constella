import create from 'zustand'
import shallow from 'zustand/shallow'

const useStoreImpl = create(() => {
  return {
    router: null,
    dom: null,
    fov: 50
  }
})

const useStore = (sel) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

export { getState, setState }
export default useStore
