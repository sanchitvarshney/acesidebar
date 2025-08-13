import React from 'react'

import { Typography } from '@mui/material';
import SettingCard from '../../components/SettingCard';
import { settingAcountData } from '../../../data/setting';
import SettingsCards from '../../../components/Settings/SettingsCards';

const AccountPage = () => {
  return (
    <div>
        
     
              
             {/* @ts-ignore */}
                  <SettingsCards  cards={settingAcountData} />
      
        </div>
  )
}

export default AccountPage