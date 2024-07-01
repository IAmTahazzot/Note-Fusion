import React, { useEffect } from 'react'

interface IUseObserver {
  ref: React.RefObject<Element>
  options: IntersectionObserverInit
}

const useIntersectionObserver = ({ ref, options }: IUseObserver) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true)
      } else {
        setIsIntersecting(false)
      }
    }, options)

    if (!(ref.current instanceof Element)) {
      return () => observer.disconnect()
    }

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

export default useIntersectionObserver
