import React from 'react'
import RecentSection from '../../../components/Settings/RecentSection'
import SettingsCards from '../../../components/Settings/SettingsCards'
import { recentSettingsData } from '../../../data/setting'


const RecentPage = () => {
  return (
    <>
     {/* <RecentSection /> */}
     {/* @ts-ignore */}
        <SettingsCards  cards={recentSettingsData}/>
    </>  
      
  )
}

export default RecentPage