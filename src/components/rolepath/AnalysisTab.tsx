'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { RoadmapData, SkillGapAnalysis } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, ListChecks, Target, AlertTriangle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Label
} from 'recharts';
import { Progress } from '@/components/ui/progress';

interface AnalysisTabProps {
  analysis: SkillGapAnalysis;
  roadmapData: RoadmapData;
}

const priorityClasses = {
  High: 'bg-red-500/10 text-red-500 border-red-500/50',
  Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50',
  Low: 'bg-green-500/10 text-green-500 border-green-500/50',
};

const difficultyClasses = {
    Beginner: 'bg-sky-500/10 text-sky-500 border-sky-500/50',
    Intermediate: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/50',
    Advanced: 'bg-purple-500/10 text-purple-500 border-purple-500/50',
}

export default function AnalysisTab({ analysis, roadmapData }: AnalysisTabProps) {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No analysis data available.</p>
        </CardContent>
      </Card>
    );
  }

  const { missingSkills, weakSkills, learningPlan, summary } = analysis;
  
  const chartData = learningPlan.slice(0, 7).map(skill => ({
      subject: skill.skill,
      A: skill.estimatedHours,
      fullMark: Math.max(...learningPlan.map(s => s.estimatedHours), 100)
  }));
  
  const completedTasks = roadmapData.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = roadmapData.tasks?.length || 0;
  const jobReadinessScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Lightbulb className="text-primary" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{summary}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
         <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Skill Radar</CardTitle>
            <CardDescription>A visual representation of your learning plan focus.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
             <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, chartData[0]?.fullMark || 150]} tick={false} axisLine={false} />
                <Radar name="Learning Hours" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                     <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <Trophy className="text-amber-500" />
                        Job-Readiness Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative h-32 w-32">
                             <svg className="h-full w-full" viewBox="0 0 36 36">
                                <path
                                className="stroke-current text-secondary"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                strokeWidth="4"
                                fill="none"
                                />
                                <path
                                className="stroke-current text-primary"
                                strokeDasharray={`${jobReadinessScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                />
                            </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{jobReadinessScore}%</span>
                            </div>
                        </div>
                    </div>
                     <p className="text-center text-muted-foreground mt-2 text-sm">Based on your roadmap task completion.</p>
                </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
               <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Missing Skills</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{missingSkills.length}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Weak Skills</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{weakSkills.length}</div>
                </CardContent>
            </Card>
            </div>
        </div>
      </div>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <ListChecks className="text-blue-500" />
            Prioritized Learning Plan
          </CardTitle>
          <CardDescription>
            A prioritized plan to help you close your skill gaps efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Estimated Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learningPlan.map((item) => (
                <TableRow key={item.skill}>
                  <TableCell className="font-medium">{item.skill}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(priorityClasses[item.priority])}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className={cn(difficultyClasses[item.difficulty])}>
                        {item.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.estimatedHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
