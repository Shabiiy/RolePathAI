'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import InterviewTab from '@/components/rolepath/InterviewTab';

export default function InterviewPage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    return (
        <div className="p-4 md:p-8">
            {currentRoadmap && <InterviewTab roadmapData={currentRoadmap} />}
        </div>
    )
}
