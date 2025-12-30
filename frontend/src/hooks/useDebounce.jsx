import { useEffect, useState, useRef, useCallback } from "react";
import instance from "../config/axiosConfig";

const useDebounce = (initialValue = "", delay = 500) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);
    const abortControllerRef = useRef(null);
    const timeoutRef = useRef(null);

    // Debounce effect for value changes
    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, delay]);

    
    const cancelApiCall = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const makeApiCall = useCallback(async (config) => {
        // Cancel any ongoing API call
        cancelApiCall();

        abortControllerRef.current = new AbortController();

        try {
            const response = await instance({
                ...config,
                signal: abortControllerRef.current.signal
            });
            return { success: true, data: response.data, response };
        } catch (error) {
            if (error.name === 'AbortError') {
                return { success: false, cancelled: true, error };
            }
            return { success: false, cancelled: false, error };
        }
    }, [cancelApiCall]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelApiCall();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [cancelApiCall]);

    return {
        value,
        setValue,
        debouncedValue,
        makeApiCall,
        cancelApiCall
    };
};

export default useDebounce;