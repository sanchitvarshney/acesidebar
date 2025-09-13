import React, { useEffect, useState } from 'react';
import { usePermission } from '../../contextApi/PermissionContext';
import { Module } from '../../types/permissionTypes';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { state, getUsersByModule } = usePermission();
  const navigate = useNavigate();
  const [moduleStats, setModuleStats] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Calculate user counts for each module
    const stats: { [key: string]: number } = {};
    state.modules.forEach((module) => {
      stats[module.id] = getUsersByModule(module.id).length;
    });
    setModuleStats(stats);
  }, [state.modules, state.userModuleAccess, getUsersByModule]);

  const handleModuleClick = (moduleId: string) => {
    navigate(`/admin/user-management?module=${moduleId}`);
  };

  const handleMenuClick = (menu: string) => {
    switch (menu) {
      case 'users':
        navigate('/admin/user-management');
        break;
      case 'roles':
        navigate('/admin/role-management');
        break;
      case 'teams':
        navigate('/admin/team-management');
        break;
      case 'permissions':
        navigate('/admin/permission-visualization');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your TMS system modules and permissions</p>
        </div>

        {/* Quick Actions Menu */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleMenuClick('users')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-medium text-gray-900">Users</h3>
              <p className="text-sm text-gray-600">Manage user access</p>
            </button>
            <button
              onClick={() => handleMenuClick('roles')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="font-medium text-gray-900">Roles</h3>
              <p className="text-sm text-gray-600">Configure roles</p>
            </button>
            <button
              onClick={() => handleMenuClick('teams')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="text-2xl mb-2">🏢</div>
              <h3 className="font-medium text-gray-900">Teams</h3>
              <p className="text-sm text-gray-600">Manage teams</p>
            </button>
            <button
              onClick={() => handleMenuClick('permissions')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium text-gray-900">Permissions</h3>
              <p className="text-sm text-gray-600">View matrix</p>
            </button>
          </div>
        </div>

        {/* Modules Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects / Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.modules.map((module) => (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl mb-2">{module.icon}</div>
                  <div className="text-sm text-gray-500">
                    {moduleStats[module.id] || 0} users
                  </div>
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
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Manage →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📈</div>
              <p>No recent activity to display</p>
              <p className="text-sm">Activity will appear here as users interact with the system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
