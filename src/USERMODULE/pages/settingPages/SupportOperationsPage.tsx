
import SettingsCards from '../../../components/Settings/SettingsCards';
import { settingSupportData } from '../../../data/setting';


const SupportOperationsPage = () => {
  return (
     <div>
        
       {/* @ts-ignore */}
       <SettingsCards cards={settingSupportData} />
        </div>
  )
}

export default SupportOperationsPage