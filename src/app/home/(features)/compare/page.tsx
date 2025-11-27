'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import CompareRolesTab from '@/components/rolepath/CompareRolesTab';

export default function ComparePage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    return (
        <div className="p-4 md:p-8">
            <CompareRolesTab roadmapData={currentRoadmap} />
        </div>
    )
}
