import React from 'react';

// Simple Spinner component
const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-gray-300 border-gray-200"></div>
    </div>
  );
};

export default Spinner;
