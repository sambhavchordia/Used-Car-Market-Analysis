import React from "react";

const Spinner = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-6 w-6 border-2",
    large: "h-8 w-8 border-3",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner; 