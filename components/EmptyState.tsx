import React from 'react';

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
      <i className="fas fa-calendar-plus text-3xl text-indigo-400"></i>
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">No active countdowns</h2>
    <p className="text-gray-500 max-w-sm">
      Click "Add Event" to start tracking your deadlines.
    </p>
  </div>
);

export default EmptyState;
