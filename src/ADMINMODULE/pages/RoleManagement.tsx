import React, { useState } from 'react';
import { usePermission } from '../../contextApi/PermissionContext';
import { Role, Permission, RoleFormData } from '../../types/permissionTypes';

const RoleManagement: React.FC = () => {
  const { state, getRolesByModule, getPermissionsByModule } = usePermission();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    moduleId: '',
    permissions: [],
  });

  const filteredRoles = selectedModule ? getRolesByModule(selectedModule) : state.roles;
  const modulePermissions = selectedModule ? getPermissionsByModule(selectedModule) : [];

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      moduleId: selectedModule || '',
      permissions: [],
    });
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      id: role.id,
      name: role.name,
      description: role.description,
      moduleId: role.moduleId,
      permissions: role.permissions,
    });
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    // Here you would typically dispatch an action to save the role
    console.log('Saving role:', formData);
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const handlePermissionToggle = (permissionId: string) => {
    const permissions = formData.permissions.includes(permissionId)
      ? formData.permissions.filter(id => id !== permissionId)
      : [...formData.permissions, permissionId];
    setFormData({ ...formData, permissions });
  };

  const groupedPermissions = modulePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as { [key: string]: Permission[] });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">Create and manage roles with specific permissions</p>
        </div>

        {/* Module Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Modules</option>
                {state.modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddRole}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-6"
            >
              Add New Role
            </button>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                        {role.isDefault && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {state.modules.find(m => m.id === role.moduleId)?.name || role.moduleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.permissions.length} permissions
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        {!role.isDefault && (
                          <button
                            onClick={() => console.log('Delete role:', role.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingRole ? 'Edit Role' : 'Add New Role'}
                  </h3>
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSaveRole(); }}>
                  <div className="space-y-4">
                    {/* Role Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter role name"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Enter role description"
                        required
                      />
                    </div>

                    {/* Module Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module
                      </label>
                      <select
                        value={formData.moduleId}
                        onChange={(e) => setFormData({ ...formData, moduleId: e.target.value, permissions: [] })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a module</option>
                        {state.modules.map((module) => (
                          <option key={module.id} value={module.id}>
                            {module.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Permissions */}
                    {formData.moduleId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Permissions
                        </label>
                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4">
                          {Object.entries(groupedPermissions).map(([category, permissions]) => (
                            <div key={category} className="mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                                {category}
                              </h4>
                              <div className="space-y-2">
                                {permissions.map((permission) => (
                                  <label
                                    key={permission.id}
                                    className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.permissions.includes(permission.id)}
                                      onChange={() => handlePermissionToggle(permission.id)}
                                      className="mt-1 mr-3 text-blue-600"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {permission.name}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Actions */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowRoleModal(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingRole ? 'Update Role' : 'Create Role'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
