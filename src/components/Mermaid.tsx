'use client'

import { useEffect, useState } from 'react'

type MermaidProps = {
  chart: string
}

let mermaidAPI: any = null

const Mermaid = ({ chart }: MermaidProps) => {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initMermaid = async () => {
      setLoading(true)
      try {
        if (!mermaidAPI) {
          const mermaid = await import('mermaid')
          const isDarkMode = document.documentElement.classList.contains('dark')

          const themeVariables = isDarkMode
            ? {
                background: 'transparent',
                primaryColor: '#27272a', // hsl(240 3.7% 15.9%)
                primaryTextColor: '#f8f8fa', // hsl(0 0% 98%)
                primaryBorderColor: '#7B8CED', // dark primary
                lineColor: '#B8A2E0', // dark accent
                fontSize: '16px',
              }
            : {
                background: 'transparent',
                primaryColor: '#FFFFFF', // #FFFFFF
                primaryTextColor: '#09090b', // hsl(240 10% 3.9%)
                primaryBorderColor: '#3F51B5', // primary
                lineColor: '#9575CD', // accent
                fontSize: '16px',
              }

          mermaid.default.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables,
          })
          mermaidAPI = mermaid.default
        }

        if (!chart) {
          setSvg(null)
          setError(null)
          setLoading(false)
          return
        }

        const id = `mermaid-graph-${Math.random().toString(36).substring(2, 9)}`
        const { svg: renderedSvg } = await mermaidAPI.render(id, chart)
        setSvg(renderedSvg)
        setError(null)
      } catch (e: any) {
        console.error('Mermaid rendering error:', e.message)
        setError('Could not render mind map. The Mermaid syntax might be invalid.')
        setSvg(null)
      } finally {
        setLoading(false)
      }
    }
    initMermaid()
  }, [chart])

  if (loading) {
    return <div className="p-4 text-center">Loading Mind Map...</div>
  }
  if (error) {
    return <div className="p-4 text-center text-destructive">{error}</div>
  }
  if (!svg) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No mind map to display.
      </div>
    )
  }

  return (
    <div
      className="w-full flex justify-center items-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Mermaid
