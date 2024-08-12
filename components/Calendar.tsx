import React, { useState } from 'react';

const Calendar: React.FC = () => {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const renderCalendarView = () => {
    switch (view) {
      case 'daily':
        return <div>Daily View</div>;
      case 'weekly':
        return <div>Weekly View</div>;
      case 'monthly':
        return <div>Monthly View</div>;
      case 'yearly':
        return <div>Yearly View</div>;
      default:
        return <div>Monthly View</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full transition-all duration-300 ease-in-out">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-4 lg:mb-0 transition-all duration-300 ease-in-out">
          Calendar
        </h2>
        <div className="flex flex-wrap justify-center lg:justify-end space-x-2">
          <button
            onClick={() => setView('daily')}
            className={`px-3 py-1 mb-2 lg:mb-0 rounded transition-all duration-300 ease-in-out ${view === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`px-3 py-1 mb-2 lg:mb-0 rounded transition-all duration-300 ease-in-out ${view === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1 mb-2 lg:mb-0 rounded transition-all duration-300 ease-in-out ${view === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView('yearly')}
            className={`px-3 py-1 mb-2 lg:mb-0 rounded transition-all duration-300 ease-in-out ${view === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="transition-all duration-300 ease-in-out">{renderCalendarView()}</div>
    </div>
  );
};

export default Calendar;
