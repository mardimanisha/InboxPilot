
import React from "react";
import { Button } from "@/components/ui/button";

interface SettingsActionsProps {
  onReset: () => void;
  onSave: () => void;
  isLoading?: boolean;
  hasChanges?: boolean;
}

const SettingsActions: React.FC<SettingsActionsProps> = ({
  onReset,
  onSave,
  isLoading = false,
  hasChanges = true,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline" 
        onClick={onReset}
        disabled={isLoading}
      >
        Reset to Defaults
      </Button>
      <Button 
        onClick={onSave}
        disabled={isLoading || !hasChanges}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default SettingsActions;