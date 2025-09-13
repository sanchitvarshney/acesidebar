import React from 'react';
import { PermissionMatrix, Permission } from '../../types/permissionTypes';

interface PermissionMatrixProps {
  matrix: PermissionMatrix[];
  permissions: Permission[];
  groupedPermissions: { [category: string]: Permission[] };
  onPermissionToggle?: (roleId: string, permissionId: string, checked: boolean) => void;
  editable?: boolean;
}

const PermissionMatrixComponent: React.FC<PermissionMatrixProps> = ({
  matrix,
  permissions,
  groupedPermissions,
  onPermissionToggle,
  editable = false,
}) => {
  const handlePermissionToggle = (roleId: string, permissionId: string, checked: boolean) => {
    if (onPermissionToggle && editable) {
      onPermissionToggle(roleId, permissionId, checked);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                Role
              </th>
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <th key={category} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                  <div className="transform -rotate-45 origin-center whitespace-nowrap">
                    {category}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matrix.map((role) => (
              <tr key={role.roleId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                  <div className="text-sm font-medium text-gray-900">{role.roleName}</div>
                </td>
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <td key={category} className="px-6 py-4 text-center border-l border-gray-200">
                    <div className="flex flex-wrap justify-center gap-1">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className={`w-4 h-4 rounded-full ${
                            role.permissions[permission.id]
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          } ${editable ? 'cursor-pointer hover:opacity-80' : ''}`}
                          title={`${permission.name}: ${permission.description}`}
                          onClick={() => 
                            editable && handlePermissionToggle(role.roleId, permission.id, !role.permissions[permission.id])
                          }
                        />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrixComponent;
