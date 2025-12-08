'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import RoadmapTab from '@/components/rolepath/RoadmapTab';

export default function RoadmapPage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    return (
        <div className="p-4 md:p-8">
            {currentRoadmap?.roadmap && <RoadmapTab roadmap={currentRoadmap.roadmap} mindmapImage={currentRoadmap.mindmapImage} />}
        </div>
    )
}
