'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import ResourcesTab from '@/components/rolepath/ResourcesTab';

export default function ResourcesPage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    return (
        <div className="p-4 md:p-8">
            {currentRoadmap?.resources && <ResourcesTab matchedResources={currentRoadmap.resources} />}
        </div>
    )
}
