'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import RecommendResourcesTab from '@/components/rolepath/RecommendResourcesTab';

export default function RecommendPage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    return (
        <div className="p-4 md:p-8">
            <RecommendResourcesTab roadmapData={currentRoadmap} />
        </div>
    )
}
