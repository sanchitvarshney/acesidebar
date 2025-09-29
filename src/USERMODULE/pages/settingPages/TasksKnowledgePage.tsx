import React from 'react';

const TasksKnowledgePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks & Knowledge</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Tasks & Knowledge settings will be implemented here.</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">• Tasks management</p>
          <p className="text-sm text-gray-500">• Knowledge base</p>
        </div>
      </div>
    </div>
  );
};

export default TasksKnowledgePage;
