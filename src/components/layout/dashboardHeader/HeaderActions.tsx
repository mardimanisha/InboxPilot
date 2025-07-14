
import { useHeaderContext } from "@/context/header-context";
import { Input } from "@/components/ui/input";

export const HeaderActions = () => {
  const { search, actions } = useHeaderContext();

  return (
    <div className="flex items-center space-x-4">
      {search && (
        <div className="relative flex items-center space-x-2">
          {search.icon}
          <Input
            placeholder={search.placeholder}
            className={search.inputClass}
          />
        </div>
      )}
      {actions?.map((action) => (
        <div key={action.id}>{action.element}</div>
      ))}
    </div>
  );
};
