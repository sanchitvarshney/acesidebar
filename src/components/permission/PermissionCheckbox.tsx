import React from 'react';
import { Permission } from '../../types/permissionTypes';

interface PermissionCheckboxProps {
  permission: Permission;
  checked: boolean;
  onChange: (permissionId: string, checked: boolean) => void;
  disabled?: boolean;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
  permission,
  checked,
  onChange,
  disabled = false,
  showDescription = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <input
        type="checkbox"
        id={permission.id}
        checked={checked}
        onChange={(e) => onChange(permission.id, e.target.checked)}
        disabled={disabled}
        className={`${sizeClasses[size]} text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={permission.id}
          className={`${textSizeClasses[size]} font-medium text-gray-900 cursor-pointer ${
            disabled ? 'opacity-50' : ''
          }`}
        >
          {permission.name}
        </label>
        {showDescription && (
          <p className={`${textSizeClasses[size]} text-gray-600 mt-1`}>
            {permission.description}
          </p>
        )}
        <div className="flex items-center mt-1 space-x-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              permission.isDefault
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {permission.isDefault ? 'Default' : 'Custom'}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            {permission.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PermissionCheckbox;
