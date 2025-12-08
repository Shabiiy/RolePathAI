'use client'

import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
    chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [error, setError] = React.useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'base',
                securityLevel: 'loose',
                themeVariables: {
                    primaryColor: '#ef4444', // Red-500
                    primaryTextColor: '#ffffff',
                    primaryBorderColor: '#000000',
                    lineColor: '#000000',
                    secondaryColor: '#1f2937', // Gray-800 (Black-ish)
                    tertiaryColor: '#ffffff',
                    fontFamily: 'inherit',
                },
                mindmap: {
                    useMaxWidth: false,
                },
            })
        }
    }, [])

    useEffect(() => {
        if (ref.current && chart) {
            // Reset error
            setError(null)

            // Unique ID for each render
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

            try {
                mermaid.render(id, chart).then(({ svg }) => {
                    if (ref.current) {
                        ref.current.innerHTML = svg
                    }
                }).catch(e => {
                    console.error('Mermaid render error:', e)
                    setError(e.message)
                })
            } catch (error: any) {
                console.error('Mermaid sync error:', error)
                setError(error.message)
            }
        }
    }, [chart])

    if (!chart) return null;

    return (
        <div className="w-full flex flex-col items-center">
            <div ref={ref} className="w-full overflow-x-auto flex justify-center p-4 min-h-[300px]" />
            {error && (
                <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50 w-full">
                    <p className="font-bold">Mindmap Rendering Error:</p>
                    <pre className="text-xs overflow-auto mt-2">{error}</pre>
                    <p className="mt-4 font-bold">Raw Syntax:</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">{chart}</pre>
                </div>
            )}
            <details className="w-full mt-4 text-xs text-gray-400">
                <summary>Debug: View Raw Mermaid Syntax</summary>
                <pre className="bg-slate-900 p-2 rounded mt-2 overflow-auto whitespace-pre-wrap">
                    {chart}
                </pre>
            </details>
        </div>
    )
}
