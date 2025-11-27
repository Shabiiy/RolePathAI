'use client'

import { useRouter } from 'next/navigation';
import { useRolePathStore } from '@/hooks/use-rolepath-store';
import HistoryTab from '@/components/rolepath/HistoryTab';

export default function HistoryPage() {
    const [state, { setCurrentRoadmap }] = useRolePathStore();
    const router = useRouter();

    const handleSelectRoadmap = (index: number) => {
        setCurrentRoadmap(index);
        router.push('/home/dashboard');
    }

    return (
        <div className="p-4 md:p-8">
            <HistoryTab 
                roadmaps={state.roadmaps}
                currentIndex={state.currentRoadmapIndex}
                onSelectRoadmap={handleSelectRoadmap}
            />
        </div>
    )
}
