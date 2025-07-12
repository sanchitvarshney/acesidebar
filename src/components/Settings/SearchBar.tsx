import React from "react";

const SettingsSearchBar: React.FC = () => {
  return (
    <div className="w-full flex items-center mb-6">
      <input
        type="text"
        placeholder="Search settings"
        className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ maxWidth: 600 }}
      />
    </div>
  );
};

export default SettingsSearchBar;
