'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import AnalysisTab from '@/components/rolepath/AnalysisTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalysisPage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    if (!currentRoadmap?.analysis) {
         return (
            <div className="p-4 md:p-8">
                <Card>
                    <CardHeader><CardTitle>No Analysis Available</CardTitle></CardHeader>
                    <CardContent><p>Skill gap analysis has not been generated for this roadmap.</p></CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <AnalysisTab analysis={currentRoadmap.analysis} roadmapData={currentRoadmap} />
        </div>
    )
}
