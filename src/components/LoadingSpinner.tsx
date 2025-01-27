import {ReactElement} from "react";

const LoadingSpinner = (): ReactElement => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;