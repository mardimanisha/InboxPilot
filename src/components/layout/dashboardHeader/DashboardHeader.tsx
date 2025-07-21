
import { HeaderTitle } from "./HeaderTitle";
import { HeaderActions } from "./HeaderActions";

export const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <HeaderTitle />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};