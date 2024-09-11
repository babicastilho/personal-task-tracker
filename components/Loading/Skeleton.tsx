import React, { useState, useEffect } from 'react';

interface SkeletonProps {
  repeatCount?: number;  // Number of times to repeat the entire set
  count?: number;        // Number of individual skeletons within each set
  type?: 'text' | 'input' | 'button'; // Type of skeleton to render
  widths?: string[];      // Array of widths for each skeleton
  skeletonDuration?: number;  // Duration to show skeletons before hiding (in milliseconds)
}

const SkeletonLoader: React.FC<SkeletonProps> = ({
  repeatCount = 1,
  count = 1,
  type = 'text',
  widths = ['w-full', 'w-3/4', 'w-1/2'],
  skeletonDuration = 1000, // Default duration to show skeletons before hiding
}) => {
  const [showSkeleton, setShowSkeleton] = useState(true); // State to show skeleton initially

  // Set a timer to hide skeleton after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false); // Hide skeleton after duration
    }, skeletonDuration);

    return () => clearTimeout(timer); // Clean up the timer
  }, [skeletonDuration]);

  // Function to render the skeleton based on type and width
  const renderSkeleton = (index: number) => {
    const widthClass = widths[index % widths.length] || 'w-full'; // Cycle through widths

    switch (type) {
      case 'text':
        return <div className={`skeleton h-4 ${widthClass}`}></div>;  // Text skeleton
      case 'input':
        return <div className={`skeleton h-8 ${widthClass}`}></div>; // Input skeleton
      case 'button':
        return <div className={`skeleton h-10 ${widthClass}`}></div>; // Button skeleton
      default:
        return null;
    }
  };

  // Show skeletons while loading
  if (showSkeleton) {
    return (
      <div className="skeleton-container space-y-4 p-4">
        {Array.from({ length: repeatCount }).map((_, idx) => (
          <div key={idx} className="skeleton-set space-y-4 pb-5">
            {Array.from({ length: count }).map((_, innerIdx) => (
              <div key={innerIdx} className="skeleton-item">
                {renderSkeleton(innerIdx)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Return null when the skeleton is hidden
  return null;
};

export default SkeletonLoader;
