import React from 'react';

const EmailsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Emails</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Email settings will be implemented here.</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">• Email settings</p>
          <p className="text-sm text-gray-500">• Email notifications</p>
          <p className="text-sm text-gray-500">• Templates</p>
          <p className="text-sm text-gray-500">• Banlist</p>
          <p className="text-sm text-gray-500">• Diagnostics</p>
        </div>
      </div>
    </div>
  );
};

export default EmailsPage;
