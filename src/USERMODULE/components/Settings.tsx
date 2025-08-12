import React from "react";
import SettingsMenu from "../../components/Settings/SettingsMenu";
import SettingsSearchBar from "../../components/Settings/SearchBar";



import { Outlet } from "react-router-dom";

const Settings: React.FC = () => {
  // const handleSelect = (title: string) => {
  //   if (title === "Recent" && recentRef.current) {
  //     recentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  //     return;
  //   }
  //   const ref = sectionRefs[title];
  //   if (ref?.current) {
  //     ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // };
  return (
    <div className="flex w-full h-[calc(100vh-100px)] bg-gray-50">
      <SettingsMenu  />
      <main className="flex-1 p-4 overflow-y-auto">
        <SettingsSearchBar />
        <div className="mb-4">
         <Outlet />
        </div>
    

      </main>
    </div>
  );
};

export default Settings;
