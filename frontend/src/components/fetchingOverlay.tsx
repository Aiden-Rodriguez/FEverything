import React from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  isDBError: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, isDBError }) => {
    if (!isLoading) return null;
  
    const displayText = isDBError ? "Failed to fetch data. Please reload or try again later." : "Loading user data...";
  
    return (
      <div style={overlayStyle}>
        <div style={textStyle}>{displayText}</div>
      </div>
    );
  };

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const textStyle: React.CSSProperties = {
  color: "white",
  fontSize: "2rem",
  fontWeight: "bold",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: "20px 40px",
  borderRadius: "10px",
};

export default LoadingOverlay;
