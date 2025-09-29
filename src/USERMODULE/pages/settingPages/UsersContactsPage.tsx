import React from 'react';

const UsersContactsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users & Contacts</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Users & Contacts settings will be implemented here.</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">• Users management</p>
          <p className="text-sm text-gray-500">• Contact fields</p>
          <p className="text-sm text-gray-500">• Company fields</p>
        </div>
      </div>
    </div>
  );
};

export default UsersContactsPage;
