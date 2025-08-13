
import SettingsCards from '../../../components/Settings/SettingsCards';
import { settingWorkflowData } from '../../../data/setting';


const WorkflowPage = () => {
  return (
     <div>
        {/* @ts-ignore */}
      <SettingsCards cards={settingWorkflowData} />
        </div>
  )
}

export default WorkflowPage