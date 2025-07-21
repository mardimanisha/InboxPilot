
import { useHeaderContext } from "@/contexts/header-context";
import { Badge } from "@/components/ui/badge";

export const HeaderTitle = () => {
  const { title, badge } = useHeaderContext();

  return (
    <div className="flex items-center space-x-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {badge && <Badge className={badge.className}>{badge.text}</Badge>}
    </div>
  );
};