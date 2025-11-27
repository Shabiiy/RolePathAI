'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import QuizTab from '@/components/rolepath/QuizTab';

export default function QuizPage() {
    const [state] = useRolePathStore();
    const currentRoadmap = state.roadmaps[state.currentRoadmapIndex];

    return (
        <div className="p-4 md:p-8">
            {currentRoadmap?.roadmap && <QuizTab roadmap={currentRoadmap.roadmap} />}
        </div>
    )
}
