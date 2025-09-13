import React, { useState, useEffect } from 'react';
import { usePermission } from '../../contextApi/PermissionContext';
import { User, Module, Role, Permission, Team, Department, UserFormData } from '../../types/permissionTypes';
import { useSearchParams } from 'react-router-dom';

const UserManagement: React.FC = () => {
  const { state, getPermissionsByModule, getRolesByModule, getTeamsByModule, getDepartmentsByModule } = usePermission();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({
    moduleId: searchParams.get('module') || '',
    roleId: '',
    customPermissions: [],
    teams: [],
    departments: [],
    primaryDepartment: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const steps = [
    { id: 1, title: 'Select Module', description: 'Choose the project/module' },
    { id: 2, title: 'Select User', description: 'Choose or add a user' },
    { id: 3, title: 'Assign Role', description: 'Set user role and permissions' },
    { id: 4, title: 'Extra Permissions', description: 'Add custom permissions' },
    { id: 5, title: 'Teams & Departments', description: 'Assign organizational units' },
    { id: 6, title: 'Review & Save', description: 'Confirm and save changes' },
  ];

  const handleModuleChange = (moduleId: string) => {
    setFormData({ ...formData, moduleId, roleId: '', customPermissions: [], teams: [], departments: [] });
    setSearchParams({ module: moduleId });
  };

  const handleRoleChange = (roleId: string) => {
    const role = getRolesByModule(formData.moduleId).find(r => r.id === roleId);
    setFormData({ ...formData, roleId, customPermissions: [] });
  };

  const handlePermissionToggle = (permissionId: string, isCustom: boolean = false) => {
    if (isCustom) {
      const customPermissions = formData.customPermissions.includes(permissionId)
        ? formData.customPermissions.filter(id => id !== permissionId)
        : [...formData.customPermissions, permissionId];
      setFormData({ ...formData, customPermissions });
    } else {
      // This would be handled by role selection
    }
  };

  const handleTeamToggle = (teamId: string) => {
    const teams = formData.teams.includes(teamId)
      ? formData.teams.filter(id => id !== teamId)
      : [...formData.teams, teamId];
    setFormData({ ...formData, teams });
  };

  const handleDepartmentToggle = (departmentId: string) => {
    const departments = formData.departments.includes(departmentId)
      ? formData.departments.filter(id => id !== departmentId)
      : [...formData.departments, departmentId];
    setFormData({ ...formData, departments });
  };

  const handlePrimaryDepartmentChange = (departmentId: string) => {
    setFormData({ ...formData, primaryDepartment: departmentId });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ModuleSelectionStep modules={state.modules} selectedModule={formData.moduleId} onModuleSelect={handleModuleChange} />;
      case 2:
        return <UserSelectionStep users={state.users} selectedUser={selectedUser} onUserSelect={setSelectedUser} onAddUser={() => setShowAddUserModal(true)} />;
      case 3:
        return <RoleAssignmentStep 
          roles={getRolesByModule(formData.moduleId)} 
          permissions={getPermissionsByModule(formData.moduleId)}
          selectedRole={formData.roleId}
          onRoleSelect={handleRoleChange}
        />;
      case 4:
        return <ExtraPermissionsStep 
          permissions={getPermissionsByModule(formData.moduleId)}
          selectedRole={formData.roleId}
          customPermissions={formData.customPermissions}
          onPermissionToggle={handlePermissionToggle}
        />;
      case 5:
        return <TeamsDepartmentsStep 
          teams={getTeamsByModule(formData.moduleId)}
          departments={getDepartmentsByModule(formData.moduleId)}
          selectedTeams={formData.teams}
          selectedDepartments={formData.departments}
          primaryDepartment={formData.primaryDepartment || ''}
          onTeamToggle={handleTeamToggle}
          onDepartmentToggle={handleDepartmentToggle}
          onPrimaryDepartmentChange={handlePrimaryDepartmentChange}
        />;
      case 6:
        return <ReviewStep formData={formData} selectedUser={selectedUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage user access and permissions across modules</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
            disabled={currentStep === 6}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 6 ? 'Save Changes' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Step Components
const ModuleSelectionStep: React.FC<{
  modules: Module[];
  selectedModule: string;
  onModuleSelect: (moduleId: string) => void;
}> = ({ modules, selectedModule, onModuleSelect }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Project / Module</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => (
        <div
          key={module.id}
          onClick={() => onModuleSelect(module.id)}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedModule === module.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl mb-2">{module.icon}</div>
          <h4 className="font-medium text-gray-900">{module.name}</h4>
          <p className="text-sm text-gray-600">{module.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const UserSelectionStep: React.FC<{
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  onAddUser: () => void;
}> = ({ users, selectedUser, onUserSelect, onAddUser }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Select User</h3>
      <button
        onClick={onAddUser}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add New User
      </button>
    </div>
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onUserSelect(user)}
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedUser?.id === user.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-gray-600 font-medium">{user.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RoleAssignmentStep: React.FC<{
  roles: Role[];
  permissions: Permission[];
  selectedRole: string;
  onRoleSelect: (roleId: string) => void;
}> = ({ roles, permissions, selectedRole, onRoleSelect }) => {
  const selectedRoleData = roles.find(r => r.id === selectedRole);
  const rolePermissions = selectedRoleData ? permissions.filter(p => selectedRoleData.permissions.includes(p.id)) : [];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Role</h3>
      
      {/* Role Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
        <select
          value={selectedRole}
          onChange={(e) => onRoleSelect(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a role...</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name} - {role.description}
            </option>
          ))}
        </select>
      </div>

      {/* Role Permissions */}
      {selectedRoleData && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Default Role Permissions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rolePermissions.map((permission) => (
              <div key={permission.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 mr-3 text-blue-600"
                />
                <div>
                  <p className="font-medium text-gray-900">{permission.name}</p>
                  <p className="text-sm text-gray-600">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExtraPermissionsStep: React.FC<{
  permissions: Permission[];
  selectedRole: string;
  customPermissions: string[];
  onPermissionToggle: (permissionId: string, isCustom: boolean) => void;
}> = ({ permissions, customPermissions, onPermissionToggle }) => {
  const selectedRolePermissions = permissions.filter(p => p.isDefault);
  const extraPermissions = permissions.filter(p => !p.isDefault);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Extra / Custom Permissions</h3>
      
      <div className="space-y-6">
        {/* Extra Permissions */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Additional Permissions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {extraPermissions.map((permission) => (
              <div key={permission.id} className="flex items-start p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={customPermissions.includes(permission.id)}
                  onChange={() => onPermissionToggle(permission.id, true)}
                  className="mt-1 mr-3 text-blue-600"
                />
                <div>
                  <p className="font-medium text-gray-900">{permission.name}</p>
                  <p className="text-sm text-gray-600">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamsDepartmentsStep: React.FC<{
  teams: Team[];
  departments: Department[];
  selectedTeams: string[];
  selectedDepartments: string[];
  primaryDepartment: string;
  onTeamToggle: (teamId: string) => void;
  onDepartmentToggle: (departmentId: string) => void;
  onPrimaryDepartmentChange: (departmentId: string) => void;
}> = ({ teams, departments, selectedTeams, selectedDepartments, primaryDepartment, onTeamToggle, onDepartmentToggle, onPrimaryDepartmentChange }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Teams & Departments</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Teams */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Teams</h4>
        <div className="space-y-2">
          {teams.map((team) => (
            <label key={team.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedTeams.includes(team.id)}
                onChange={() => onTeamToggle(team.id)}
                className="mr-3 text-blue-600"
              />
              <div>
                <p className="font-medium text-gray-900">{team.name}</p>
                <p className="text-sm text-gray-600">{team.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Departments */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Departments</h4>
        <div className="space-y-2">
          {departments.map((department) => (
            <label key={department.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedDepartments.includes(department.id)}
                onChange={() => onDepartmentToggle(department.id)}
                className="mr-3 text-blue-600"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{department.name}</p>
                <p className="text-sm text-gray-600">{department.description}</p>
              </div>
              {selectedDepartments.includes(department.id) && (
                <label className="ml-2 flex items-center">
                  <input
                    type="radio"
                    name="primaryDepartment"
                    checked={primaryDepartment === department.id}
                    onChange={() => onPrimaryDepartmentChange(department.id)}
                    className="mr-1 text-blue-600"
                  />
                  <span className="text-xs text-gray-600">Primary</span>
                </label>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ReviewStep: React.FC<{
  formData: UserFormData;
  selectedUser: User | null;
}> = ({ formData, selectedUser }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Confirm</h3>
    
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">User</h4>
        <p className="text-gray-600">{selectedUser?.name} ({selectedUser?.email})</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Module</h4>
        <p className="text-gray-600">{formData.moduleId}</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Role</h4>
        <p className="text-gray-600">{formData.roleId}</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Custom Permissions</h4>
        <p className="text-gray-600">{formData.customPermissions.length} additional permissions</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Teams & Departments</h4>
        <p className="text-gray-600">
          {formData.teams.length} teams, {formData.departments.length} departments
        </p>
      </div>
    </div>
  </div>
);

export default UserManagement;
