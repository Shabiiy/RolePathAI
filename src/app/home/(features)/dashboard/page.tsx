'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import DashboardTab from '@/components/rolepath/DashboardTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    const [state, { updateTaskCompletion }] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    const handleTaskToggle = (taskId: string, completed: boolean) => {
        updateTaskCompletion(taskId, completed);
    };

    if (!currentRoadmap) {
        return (
            <div className="p-4 md:p-8">
                <Card>
                    <CardHeader><CardTitle>No Roadmap Selected</CardTitle></CardHeader>
                    <CardContent><p>Please generate or select a roadmap to view the dashboard.</p></CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <DashboardTab state={currentRoadmap} onTaskToggle={handleTaskToggle} />
        </div>
    )
}
