import React, { createContext, useContext, useState } from "react";

const AutoSaveContext = createContext();

export const useAutoSaveContext = () => {
  const context = useContext(AutoSaveContext);
  if (!context) {
    throw new Error(
      "useAutoSaveContext must be used within an AutoSaveProvider"
    );
  }
  return context;
};

export const AutoSaveProvider = ({ children }) => {
  const [autoSaveState, setAutoSaveState] = useState(null);

  const updateAutoSaveState = (state) => {
    console.log("[AutoSaveContext] updateAutoSaveState called with:", state);
    setAutoSaveState(state);
  };

  const clearAutoSaveState = () => {
    console.log("[AutoSaveContext] clearAutoSaveState called");
    setAutoSaveState(null);
  };

  return (
    <AutoSaveContext.Provider
      value={{
        autoSaveState,
        updateAutoSaveState,
        clearAutoSaveState,
      }}
    >
      {children}
    </AutoSaveContext.Provider>
  );
};
