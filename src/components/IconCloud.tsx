import { useEffect, useMemo, useState } from "react"

// Import using require to avoid TypeScript issues
const ReactIconCloud = require("react-icon-cloud")
const { Cloud, fetchSimpleIcons, renderSimpleIcon } = ReactIconCloud

// Type declarations
interface ICloud {
  containerProps?: any
  options?: any
  children?: React.ReactNode
}

interface SimpleIcon {
  title: string
  hex: string
  path: string
}

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    // dragControl: false,
  },
}

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510"
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff"
  const minContrastRatio = theme === "dark" ? 2 : 1.2

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  })
}

export type DynamicCloudProps = {
  iconSlugs: string[]
}

type IconData = any // Simplified type for now

export function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null)
  const [theme] = useState("dark") // Default to dark theme

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData)
  }, [iconSlugs])

  const renderedIcons = useMemo(() => {
    if (!data) return null

    return Object.values(data.simpleIcons || {}).map((icon: any) =>
      renderCustomIcon(icon, theme),
    )
  }, [data, theme])

  return (
    <Cloud {...cloudProps}>
      <>{renderedIcons}</>
    </Cloud>
  )
} 