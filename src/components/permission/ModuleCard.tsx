import React from 'react';
import { Module } from '../../types/permissionTypes';

interface ModuleCardProps {
  module: Module;
  onClick?: (moduleId: string) => void;
  showUserCount?: boolean;
  userCount?: number;
  className?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onClick,
  showUserCount = true,
  userCount = 0,
  className = '',
}) => {
  return (
    <div
      onClick={() => onClick?.(module.id)}
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl mb-2">{module.icon}</div>
        {showUserCount && (
          <div className="text-sm text-gray-500">
            {userCount} users
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{module.description}</p>
      
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            module.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {module.isActive ? 'Active' : 'Inactive'}
        </span>
        
        {onClick && (
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Manage →
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
