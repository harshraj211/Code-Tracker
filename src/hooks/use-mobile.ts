
"use client"

import * as React from "react"

/**
 * A hook that returns a boolean indicating if the user is on a mobile device.
 * @returns A boolean indicating if the user is on a mobile device.
 * @example
 * const isMobile = useIsMobile()
 */
export function useIsMobile(query = "(max-width: 768px)") {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setIsMobile(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [query])

  return isMobile
}
