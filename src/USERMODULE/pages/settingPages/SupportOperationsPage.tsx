import React from 'react'
import { settingSupportData } from '../../../data/setting';
import { Typography } from '@mui/material';
import SettingCard from '../../components/SettingCard';

const SupportOperationsPage = () => {
  return (
     <div>
        
        {settingSupportData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="flex flex-col gap-3 my-3">
            <Typography variant="h6">{section.section}</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <SettingCard
                    key={itemIndex}
                    titleIcon={<Icon color="primary" />}
                    title={item.title}
                    subTitle={item.description}
                  />
                );
              })}
            </div>
          </div>
        ))}
        </div>
  )
}

export default SupportOperationsPage