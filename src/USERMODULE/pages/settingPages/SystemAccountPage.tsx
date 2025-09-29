import React from 'react';

const SystemAccountPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System & Account</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">System & Account settings will be implemented here.</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">• Company settings</p>
          <p className="text-sm text-gray-500">• Account details</p>
          <p className="text-sm text-gray-500">• Plan & billing</p>
          <p className="text-sm text-gray-500">• Account exports</p>
          <p className="text-sm text-gray-500">• System settings</p>
          <p className="text-sm text-gray-500">• API settings</p>
        </div>
      </div>
    </div>
  );
};

export default SystemAccountPage;
