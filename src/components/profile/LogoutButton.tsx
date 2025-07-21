import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface LogoutButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  onClick,
  className = "",
  variant = "outline",
  size = "default",
}) => {
  return (
    <Card>
      <CardContent>
      <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`w-full justify-start space-x-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </Button>
      </CardContent>
    </Card>
    
  );
};
