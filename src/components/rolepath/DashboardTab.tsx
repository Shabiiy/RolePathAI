'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { BADGES, TASK_XP } from '@/lib/constants'
import type { RoadmapData, Badge } from '@/types'
import { Lightbulb, Trophy } from 'lucide-react'

interface DashboardTabProps {
  state: RoadmapData | null | undefined;
  onTaskToggle: (taskId: string, completed: boolean) => void
}

import { useState, useEffect, useRef } from 'react'
import LevelUpModal from './LevelUpModal'

// ... existing imports

export default function DashboardTab({
  state,
  onTaskToggle,
}: DashboardTabProps) {
  // ... existing check for !state
  if (!state) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No roadmap data to display.</p>
        </CardContent>
      </Card>
    );
  }

  const { tasks, projects } = state
  const [showLevelUp, setShowLevelUp] = useState(false)

  // Use a ref to track the previous badge to avoid re-renders triggering it
  // Initialize with null so we don't trigger on first load unless we want to (usually we don't)
  const prevBadgeRef = useRef<string | null>(null)

  const completedTasks = tasks?.filter((task) => task.completed).length || 0
  const totalTasks = tasks?.length || 0
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const totalXp = completedTasks * TASK_XP

  const getCurrentAndNextBadge = (): { current: Badge; next: Badge | null } => {
    let currentBadge = BADGES[0]
    let nextBadge: Badge | null = null

    for (let i = 0; i < BADGES.length; i++) {
      if (totalXp >= BADGES[i].xpThreshold) {
        currentBadge = BADGES[i]
      } else {
        nextBadge = BADGES[i]
        break
      }
    }
    return { current: currentBadge, next: nextBadge }
  }

  const { current, next } = getCurrentAndNextBadge()
  const xpForNextBadge = next ? next.xpThreshold - current.xpThreshold : 0
  const progressToNextBadge = next ? totalXp - current.xpThreshold : xpForNextBadge
  const nextBadgeProgress = xpForNextBadge > 0 ? (progressToNextBadge / xpForNextBadge) * 100 : 100

  useEffect(() => {
    // If this is the first render, just set the ref
    if (prevBadgeRef.current === null) {
      prevBadgeRef.current = current.name;
      return;
    }

    // If badge name changed and it's not the initial load
    if (prevBadgeRef.current !== current.name) {
      // Only show if we actually leveled up (index is higher)
      const prevIndex = BADGES.findIndex(b => b.name === prevBadgeRef.current);
      const currIndex = BADGES.findIndex(b => b.name === current.name);

      if (currIndex > prevIndex) {
        setShowLevelUp(true);
      }
      prevBadgeRef.current = current.name;
    }
  }, [current.name]);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        badge={current}
      />
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Trophy className="text-amber-500" />
              Your Progress
            </CardTitle>
            <CardDescription>
              Track your learning journey and see how far you've come.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>Overall Roadmap Progress</span>
                <span>{totalXp} XP</span>
              </div>
              <Progress value={progressPercentage} />
              <p className="text-sm text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                  <current.icon className="w-5 h-5 text-primary" />
                  <span>Current Badge: {current.name}</span>
                </div>
                {next && (
                  <span className="text-sm text-muted-foreground">
                    Next: {next.name} ({next.xpThreshold} XP)
                  </span>
                )}
              </div>
              {next && (
                <>
                  <Progress value={nextBadgeProgress} />
                  <p className="text-sm text-muted-foreground">{progressToNextBadge} / {xpForNextBadge} XP towards next badge</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Lightbulb className="text-blue-500" />
              Micro-Project Ideas
            </CardTitle>
            <CardDescription>
              Apply your new skills with these hands-on project prompts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <ul className="space-y-3">
                {projects?.map((prompt, index) => (
                  <li key={index} className="text-sm p-3 bg-secondary rounded-md">
                    {prompt}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Skill Checklist</CardTitle>
          <CardDescription>Mark off the topics as you master them.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {tasks?.map((task, index) => (
                <div key={task.id}>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={task.id}
                      checked={task.completed}
                      onCheckedChange={(checked) =>
                        onTaskToggle(task.id, !!checked)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor={task.id}
                      className={`text-sm leading-snug cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''
                        }`}
                    >
                      {task.text}
                    </Label>
                  </div>
                  {index < tasks.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Scroll to view all {tasks?.length || 0} tasks
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
