
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AutoSyncToggleProps {
  autoSyncOnFocus: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const AutoSyncToggle: React.FC<AutoSyncToggleProps> = ({ autoSyncOnFocus, onCheckedChange }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor="autosync-toggle" className="font-semibold">Auto-sync from Clipboard</Label>
        <p className="text-sm text-muted-foreground">
          If enabled, new content is synced automatically when you focus on this page.
        </p>
      </div>
      <Switch
        id="autosync-toggle"
        checked={autoSyncOnFocus}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

export default AutoSyncToggle;
