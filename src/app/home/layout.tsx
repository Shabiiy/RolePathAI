'use client'

import HomeLayout from "@/components/rolepath/HomeLayout";
import { useRolePathStore } from "@/hooks/use-rolepath-store";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [state, , isHydrated] = useRolePathStore();

    if (!isHydrated) {
        // Render the basic layout on the server and during initial hydration
        return <HomeLayout>{null}</HomeLayout>;
    }

    return (
        <HomeLayout>
            {/* 
              By using the currentRoadmapIndex as a key, we force React to re-mount the entire
              children tree whenever the selected roadmap changes. This is the crucial fix to
              prevent stale data from being shown when a new roadmap is created or selected.
            */}
            <div key={state.currentRoadmapIndex} className="m-0 md:m-8">
                {children}
            </div>
        </HomeLayout>
    );
}
