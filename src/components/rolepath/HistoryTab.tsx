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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RoadmapData } from '@/types';
import { History, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryTabProps {
  roadmaps: RoadmapData[];
  currentIndex: number;
  onSelectRoadmap: (index: number) => void;
}

export default function HistoryTab({
  roadmaps,
  currentIndex,
  onSelectRoadmap,
}: HistoryTabProps) {
  const handleView = (index: number) => {
    onSelectRoadmap(index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <History className="text-primary" />
          Assessment History
        </CardTitle>
        <CardDescription>
          Review your previously generated career roadmaps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roadmaps.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Target Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...roadmaps].reverse().map((roadmap, revIndex) => {
                const originalIndex = roadmaps.length - 1 - revIndex;
                const isActive = originalIndex === currentIndex;
                return (
                  <TableRow key={roadmap.id} className={isActive ? 'bg-secondary/50' : ''}>
                    <TableCell className="font-medium">
                      {format(new Date(roadmap.createdAt), 'PP')}
                    </TableCell>
                    <TableCell>{roadmap.inputs?.targetJobRole}</TableCell>
                    <TableCell>
                      {isActive ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(originalIndex)}
                        disabled={isActive}
                      >
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No history yet.</p>
            <p className="text-sm mt-1">Generate a new roadmap to start your history.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
