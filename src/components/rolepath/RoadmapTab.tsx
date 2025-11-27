'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { parseRoadmap } from '@/lib/parser'
import { Network, ChevronRight } from 'lucide-react'

interface RoadmapTabProps {
  roadmap: string
}

export default function RoadmapTab({ roadmap }: RoadmapTabProps) {
  const roadmapPhases = parseRoadmap(roadmap)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Network className="text-primary" />
          Your Learning Roadmap
        </CardTitle>
        <CardDescription>
          A phase-by-phase breakdown of your learning path.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roadmapPhases.length > 0 ? (
          <Accordion type="multiple" className="w-full" defaultValue={roadmapPhases.map((_, i) => `phase-${i}`)}>
            {roadmapPhases.map((phase, index) => (
              <AccordionItem value={`phase-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold font-headline hover:no-underline">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-primary">{phase.weeks}</span>
                    Phase {index + 1}: {phase.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 border-l-2 border-primary/50 ml-2">
                  <p className="text-base font-semibold mb-3">Focus Topics:</p>
                  <ul className="list-none space-y-3">
                    {phase.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start">
                         <ChevronRight className="w-5 h-5 text-primary/80 mt-0.5 mr-2 shrink-0"/>
                         <span className="text-muted-foreground">{topic.title}</span>
                      </li>
                    ))}
                  </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Could not parse the roadmap structure.</p>
            <p className="text-xs mt-2">The generated text might not be in the expected format.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
