'use client'

import { useRolePathStore } from '@/hooks/use-rolepath-store';
import SettingsTab from '@/components/rolepath/SettingsTab';
import type { AppState } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
    const [state, { importState }] = useRolePathStore();
    const { toast } = useToast();

    const handleImport = (newState: AppState) => {
        importState(newState);
        toast({
          title: 'Import Successful',
          description: 'Your learning path has been loaded.',
        });
    };

    return (
        <div className="p-4 md:p-8">
            <SettingsTab state={state} onImport={handleImport} />
        </div>
    )
}
