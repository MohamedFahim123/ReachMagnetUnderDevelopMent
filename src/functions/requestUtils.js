import toast from "react-hot-toast";

// Rate Limiter
const rateLimiter = (() => {
    const requests = {};
    const MAX_REQUESTS = 5; // Set max requests per time window
    const TIME_WINDOW = 60000; // Time window in milliseconds (e.g., 1 minute)

    return (key) => {
        const now = Date.now();
        requests[key] = requests[key] || [];

        // Remove outdated requests outside the time window
        requests[key] = requests[key].filter(timestamp => now - timestamp < TIME_WINDOW);

        if (requests[key].length >= MAX_REQUESTS) {
            return false; // Block the request
        }

        requests[key].push(now); // Record this request's timestamp
        return true; // Allow the request
    };
})();

// Caching
const cache = {};
const fetchWithCache = async (endpoint, fetchFunction, cacheDuration = 60000) => { // Cache for 1 minute by default
    if (cache[endpoint] && Date.now() - cache[endpoint].timestamp < cacheDuration) {
        return cache[endpoint].data;
    }

    const data = await fetchFunction();
    cache[endpoint] = { data, timestamp: Date.now() };
    return data;
};

// Debounce Function
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};
const handleApiError = (error, setUnAuth) => {
    // Check if the error is 401 Unauthorized and handle it
    if (error?.response?.status === 401 && setUnAuth) {
        setUnAuth(true);
    }

    // Display error message to the user
    toast.error(error?.response?.data?.message || 'Something Went Wrong');
};

export { rateLimiter, fetchWithCache, debounce, handleApiError };