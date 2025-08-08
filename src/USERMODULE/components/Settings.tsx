import React from "react";
import SettingsMenu from "../../components/Settings/SettingsMenu";
import SettingsSearchBar from "../../components/Settings/SearchBar";
import RecentSection from "../../components/Settings/RecentSection";
import SettingsCards from "../../components/Settings/SettingsCards";

const Settings: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-160px)] bg-gray-50">
      <SettingsMenu />
      <main className="flex-1 p-10 overflow-y-auto">
        <SettingsSearchBar />
        <RecentSection />
        <SettingsCards />
      </main>
    </div>
  );
};

export default Settings;
