import SettingsCards from "../../../components/Settings/SettingsCards";
import { settingTeamData } from "../../../data/setting";

const TeamPage = () => {
  return (
    <div>
      {/* @ts-ignore */}
      <SettingsCards cards={settingTeamData} />
    </div>
  );
};

export default TeamPage;
