import React from "react";
import SettingsMenu from "../../components/Settings/SettingsMenu";
import SettingsSearchBar from "../../components/Settings/SearchBar";
import RecentSection from "../../components/Settings/RecentSection";
import SettingsCards from "../../components/Settings/SettingsCards";

import { Typography } from "@mui/material";

import SettingCard from "./SettingCard";
import { settingData } from "../../data/setting";

const Settings: React.FC = () => {
  const recentRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
    settingData.forEach((s) => {
      refs[s.section] = React.createRef<HTMLDivElement>();
    });
    return refs;
  }, []);

  const handleSelect = (title: string) => {
    if (title === "Recent" && recentRef.current) {
      recentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const ref = sectionRefs[title];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="flex w-full h-[calc(100vh-100px)] bg-gray-50">
      <SettingsMenu onSelect={handleSelect} />
      <main className="flex-1 p-4 overflow-y-auto">
        <SettingsSearchBar />
        <div ref={recentRef}>
          <RecentSection />
        </div>
        <SettingsCards />

        {settingData.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            ref={sectionRefs[section.section]}
            className="flex flex-col gap-3 my-3"
          >
            <Typography variant="h6">{section.section}</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <SettingCard
                    key={itemIndex}
                    titleIcon={<Icon color="primary"/>}
                    title={item.title}
                    subTitle={item.description}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Settings;
