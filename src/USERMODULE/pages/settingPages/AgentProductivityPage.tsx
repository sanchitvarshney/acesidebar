import React from 'react'
import { settingAgentProductivityData } from '../../../data/setting';
import { Typography } from '@mui/material';
import SettingCard from '../../components/SettingCard';
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