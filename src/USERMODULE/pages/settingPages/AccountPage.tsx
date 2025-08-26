import { settingAcountData } from "../../../data/setting";
import SettingsCards from "../../../components/Settings/SettingsCards";

const AccountPage = () => {
  return (
    <div>
      {/* @ts-ignore */}
      <SettingsCards cards={settingAcountData} />
    </div>
  );
};

export default AccountPage;
