'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import ProjectsTab from '@/components/rolepath/ProjectsTab';

export default function ProjectsPage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    return (
        <div className="p-4 md:p-8">
            {currentRoadmap && <ProjectsTab roadmapData={currentRoadmap} />}
        </div>
    )
}
