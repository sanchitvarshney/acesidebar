import React, { useState, useMemo } from 'react';
import { usePermission } from '../../contextApi/PermissionContext';
import { PermissionMatrix } from '../../types/permissionTypes';

const PermissionVisualization: React.FC = () => {
  const { state, getRolesByModule, getPermissionsByModule } = usePermission();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactiveRoles, setShowInactiveRoles] = useState(false);

  const moduleRoles = selectedModule ? getRolesByModule(selectedModule) : state.roles;
  const modulePermissions = selectedModule ? getPermissionsByModule(selectedModule) : state.permissions;

  // Filter roles based on search and active status
  const filteredRoles = useMemo(() => {
    return moduleRoles.filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          role.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActive = showInactiveRoles || role.isDefault;
      return matchesSearch && matchesActive;
    });
  }, [moduleRoles, searchTerm, showInactiveRoles]);

  // Filter permissions based on search
  const filteredPermissions = useMemo(() => {
    return modulePermissions.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modulePermissions, searchTerm]);

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as { [key: string]: typeof filteredPermissions });
  }, [filteredPermissions]);

  // Create permission matrix
  const permissionMatrix: PermissionMatrix[] = useMemo(() => {
    return filteredRoles.map(role => ({
      roleId: role.id,
      roleName: role.name,
      permissions: filteredPermissions.reduce((acc, permission) => {
        acc[permission.id] = role.permissions.includes(permission.id);
        return acc;
      }, {} as { [permissionId: string]: boolean })
    }));
  }, [filteredRoles, filteredPermissions]);

  const getModuleName = (moduleId: string) => {
    return state.modules.find(m => m.id === moduleId)?.name || moduleId;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Permission Visualization</h1>
          <p className="text-gray-600 mt-2">View and analyze permissions across roles and modules</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Modules</option>
                {state.modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search roles or permissions..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Show Inactive Roles */}
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showInactiveRoles}
                  onChange={(e) => setShowInactiveRoles(e.target.checked)}
                  className="mr-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">Show inactive roles</span>
              </label>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{filteredRoles.length}</div>
            <div className="text-sm text-gray-600">Roles</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{filteredPermissions.length}</div>
            <div className="text-sm text-gray-600">Permissions</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(groupedPermissions).length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {selectedModule ? getModuleName(selectedModule) : 'All Modules'}
            </div>
            <div className="text-sm text-gray-600">Module</div>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Permission Matrix</h2>
            <p className="text-sm text-gray-600">Roles vs Permissions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Role
                  </th>
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <th key={category} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                      <div className="transform -rotate-45 origin-center whitespace-nowrap">
                        {category}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissionMatrix.map((role) => (
                  <tr key={role.roleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                      <div className="text-sm font-medium text-gray-900">{role.roleName}</div>
                    </td>
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      <td key={category} className="px-6 py-4 text-center border-l border-gray-200">
                        <div className="flex flex-wrap justify-center gap-1">
                          {permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className={`w-4 h-4 rounded-full ${
                                role.permissions[permission.id]
                                  ? 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                              title={permission.name}
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

        {/* Detailed Permission List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Permission Details</h2>
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4 capitalize">
                  {category} ({permissions.length} permissions)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{permission.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          permission.isDefault
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {permission.isDefault ? 'Default' : 'Custom'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{permission.description}</p>
                      
                      {/* Show which roles have this permission */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Assigned to roles:</p>
                        <div className="flex flex-wrap gap-1">
                          {permissionMatrix
                            .filter(role => role.permissions[permission.id])
                            .map(role => (
                              <span
                                key={role.roleId}
                                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                              >
                                {role.roleName}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Permission granted</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <span className="text-sm text-gray-700">Permission not granted</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Default</span>
              <span className="text-sm text-gray-700">Default permission</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Custom</span>
              <span className="text-sm text-gray-700">Custom permission</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionVisualization;
