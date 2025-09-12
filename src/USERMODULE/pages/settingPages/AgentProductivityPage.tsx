import { settingAgentProductivityData } from '../../../data/setting';
import SettingsCards from '../../../components/Settings/SettingsCards';

const AgentProductivityPage = () => {
  return (
    <div>
        {/* @ts-ignore  */}
     <SettingsCards cards={settingAgentProductivityData} />
        </div>
  )
}

export default AgentProductivityPage