'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MatchedResource } from '@/types'
import { ArrowUpRight, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResourcesTabProps {
  matchedResources: MatchedResource[]
}

function getRelevanceClasses(score: number) {
  if (score > 0.7) return 'bg-primary/10 text-primary'
  if (score > 0.4) return 'bg-accent/10 text-accent'
  return 'bg-destructive/10 text-destructive'
}

export default function ResourcesTab({ matchedResources }: ResourcesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Curated Resources</CardTitle>
        <CardDescription>
          AI-matched learning materials to help you master the required skills.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {matchedResources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matchedResources.map((resource, index) => (
              <Card key={index} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">{resource.title}</CardTitle>
                  <div className="flex justify-between items-center pt-1">
                    <Badge variant={resource.level === 'Beginner' ? 'secondary' : resource.level === 'Intermediate' ? 'default' : 'destructive'}>
                        {resource.level}
                    </Badge>
                     <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", getRelevanceClasses(resource.confidence))}>
                            Relevance: {(resource.confidence * 100).toFixed(0)}%
                        </span>
                     </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Visit Resource <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No resources were matched for this roadmap.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
