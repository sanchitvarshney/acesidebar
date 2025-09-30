import React from 'react';

const AgentsProductivityPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agents & Productivity</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Agent management, roles, teams, and productivity tools.</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">• Agents</p>
          <p className="text-sm text-gray-500">• Roles</p>
          <p className="text-sm text-gray-500">• Teams</p>
          <p className="text-sm text-gray-500">• Departments</p>
          <p className="text-sm text-gray-500">• Canned responses</p>
          <p className="text-sm text-gray-500">• Arcade</p>
        </div>
      </div>
    </div>
  );
};

export default AgentsProductivityPage;


