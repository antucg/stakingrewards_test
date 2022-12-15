import { useEffect, useRef } from 'react'

const useInterval = (cb: () => void, delay: number | null) => {
  const savedCb = useRef(cb)
  useEffect(() => {
    savedCb.current = cb
  }, [cb])

  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = setInterval(() => savedCb.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}

export default useInterval
