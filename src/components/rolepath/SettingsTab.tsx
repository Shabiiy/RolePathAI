'use client'

import { useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { AppState } from '@/types'
import { Download, Upload, Clipboard, Check } from 'lucide-react'

interface SettingsTabProps {
  state: AppState
  onImport: (newState: AppState) => void
}

export default function SettingsTab({ state, onImport }: SettingsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleExport = () => {
    const jsonString = JSON.stringify(state, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rolepath-ai-save-v2.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: 'Export Successful',
      description: 'Your learning path history has been saved to a JSON file.',
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (typeof text !== 'string') throw new Error('Invalid file content')
        const newState = JSON.parse(text) as AppState;
        // Basic validation for new structure
        if (Array.isArray(newState.roadmaps) && 'currentRoadmapIndex' in newState) {
          onImport(newState)
        } else {
          // Attempt to migrate from old structure
           const oldState = newState as any;
            if (oldState.roadmap) {
                 const migratedRoadmap = {
                    id: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    inputs: oldState.inputs,
                    roadmap: oldState.roadmap,
                    projects: oldState.projects,
                    resources: oldState.resources,
                    tasks: oldState.tasks,
                    analysis: oldState.analysis
                }
                onImport({ roadmaps: [migratedRoadmap], currentRoadmapIndex: 0 });
            } else {
                throw new Error('Invalid save file format.');
            }
        }
      } catch (error) {
        console.error('Import error:', error)
        toast({
          variant: 'destructive',
          title: 'Import Failed',
          description:
            'The selected file is not a valid RolePath AI save file.',
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleCopyToClipboard = () => {
    try {
      const jsonString = JSON.stringify(state)
      const base64String = btoa(jsonString)
      navigator.clipboard.writeText(base64String)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: 'Copied to Clipboard',
        description: 'Share this snippet to transfer your state.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Could not copy the state to your clipboard.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Data Management
        </CardTitle>
        <CardDescription>
          Save, load, or share your personalized learning path history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Export Your State</h3>
            <p className="text-sm text-muted-foreground">
              Save your current progress and all roadmaps to a JSON file.
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </Button>
        </div>

        <div className="p-4 border rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Import Your State</h3>
            <p className="text-sm text-muted-foreground">
              Load a previously saved state from a JSON file.
            </p>
          </div>
          <Button onClick={handleImportClick} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Import JSON
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        <div className="p-4 border rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Shareable Snippet</h3>
            <p className="text-sm text-muted-foreground">
              Copy a Base64 snippet to easily share your entire state.
            </p>
          </div>
          <Button onClick={handleCopyToClipboard} variant="secondary">
            {copied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Clipboard className="mr-2 h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Snippet'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
