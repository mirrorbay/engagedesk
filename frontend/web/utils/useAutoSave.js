import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Custom hook for auto-saving data with debouncing
 * @param {Object} data - The data to auto-save
 * @param {Function} saveFunction - The function to call for saving (should return a promise)
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Debounce delay in milliseconds (default: 2000)
 * @param {boolean} options.enabled - Whether auto-save is enabled (default: true)
 * @param {Array} options.excludeFields - Fields to exclude from auto-save comparison
 * @param {Function} options.onSaveStart - Callback when save starts
 * @param {Function} options.onSaveSuccess - Callback when save succeeds
 * @param {Function} options.onSaveError - Callback when save fails
 * @param {Function} options.shouldSave - Custom function to determine if save should occur
 * @returns {Object} - Auto-save state and controls
 */
export const useAutoSave = (data, saveFunction, options = {}) => {
  const {
    delay = 2000,
    enabled = true,
    excludeFields = [],
    onSaveStart,
    onSaveSuccess,
    onSaveError,
    shouldSave,
  } = options;

  const [autoSaveState, setAutoSaveState] = useState({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const timeoutRef = useRef(null);
  const previousDataRef = useRef(null);
  const isInitializedRef = useRef(false);
  const hideIndicatorTimeoutRef = useRef(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Function to create comparable data
  const createComparableData = (inputData) => {
    if (!inputData || typeof inputData !== "object") return inputData;

    const comparable = { ...inputData };
    excludeFields.forEach((field) => {
      delete comparable[field];
    });

    return JSON.stringify(comparable);
  };

  // Function to perform the actual save
  const performSave = async (dataToSave) => {
    const currentOptions = optionsRef.current;

    if (!enabled || !saveFunction) {
      return;
    }

    if (currentOptions.shouldSave && !currentOptions.shouldSave(dataToSave)) {
      return;
    }

    console.log("[AutoSave] Starting save operation");

    if (hideIndicatorTimeoutRef.current) {
      clearTimeout(hideIndicatorTimeoutRef.current);
      hideIndicatorTimeoutRef.current = null;
    }

    setAutoSaveState((prev) => ({
      ...prev,
      isSaving: true,
      error: null,
      hasUnsavedChanges: false,
    }));

    currentOptions.onSaveStart?.();

    try {
      const result = await saveFunction(dataToSave);

      if (result && result.success === false) {
        throw new Error(result.error || "Save failed");
      }

      const now = new Date();
      console.log("[AutoSave] Save successful at:", now.toISOString());

      setAutoSaveState((prev) => ({
        ...prev,
        isSaving: false,
        lastSaved: now,
        hasUnsavedChanges: false,
        error: null,
      }));

      // Update the reference data to prevent unnecessary saves
      previousDataRef.current = createComparableData(dataToSave);
      currentOptions.onSaveSuccess?.(result);

      // Hide the indicator after 3 seconds
      hideIndicatorTimeoutRef.current = setTimeout(() => {
        setAutoSaveState((prev) => ({
          ...prev,
          lastSaved: null,
        }));
      }, 3000);
    } catch (error) {
      console.error("[AutoSave] Save failed:", error);
      setAutoSaveState((prev) => ({
        ...prev,
        isSaving: false,
        error: error.message || "Auto-save failed",
      }));
      currentOptions.onSaveError?.(error);
    }
  };

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    return performSave(data);
  }, [data]);

  // Reset auto-save state
  const resetAutoSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hideIndicatorTimeoutRef.current) {
      clearTimeout(hideIndicatorTimeoutRef.current);
      hideIndicatorTimeoutRef.current = null;
    }
    setAutoSaveState({
      isSaving: false,
      lastSaved: null,
      hasUnsavedChanges: false,
      error: null,
    });
    previousDataRef.current = null;
    isInitializedRef.current = false;
  }, []);

  // Main effect for auto-saving
  useEffect(() => {
    if (!enabled || !data || !saveFunction) {
      return;
    }

    const currentComparableData = createComparableData(data);

    // Initialize on first run
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      previousDataRef.current = currentComparableData;
      console.log("[AutoSave] Initialized with data");
      return;
    }

    // Check if data has actually changed
    const hasChanged = currentComparableData !== previousDataRef.current;

    if (!hasChanged) {
      return;
    }

    console.log("[AutoSave] Data changed, scheduling save in", delay, "ms");

    // Mark as having unsaved changes
    setAutoSaveState((prev) => ({ ...prev, hasUnsavedChanges: true }));

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      performSave(data);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, delay, saveFunction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hideIndicatorTimeoutRef.current) {
        clearTimeout(hideIndicatorTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...autoSaveState,
    saveNow,
    resetAutoSave,
  };
};

export default useAutoSave;
