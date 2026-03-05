import { FiCpu } from "react-icons/fi";

const SettingsLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-amber-500 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <FiCpu className="h-6 w-6 text-amber-500 animate-pulse" />
      </div>
    </div>
  </div>
);

export default SettingsLoader;