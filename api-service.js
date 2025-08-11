// api-service.js - Shared API service for the entire application
class ApiService {
    static async fetchFilters() {
        const FILTERS_API_URL = 'https://script.google.com/macros/s/AKfycbziQdfgsCewHNR_hSBu23W0Js7YH5JL7rOPrZERx5kwqCMeS3HUrMsZ74-gGK6hAaS3/exec';
        return this._fetchData(FILTERS_API_URL);
    }

    static async fetchGridItems() {
        const GRID_API_URL = 'https://script.google.com/macros/s/AKfycbw0qIf4g5AfkBuDsywygYQJWYWo3BxVvCpRHGdGDjK0NaMa2A3TkAusCvnYoFeYbESvLg/exec';
        return this._fetchData(GRID_API_URL);
    }

    static async fetchReviews() {
        const REVIEWS_API_URL = 'https://script.google.com/macros/s/AKfycbw1Eein40gus_koqvh_zzt5L961nQfCHwPJkHBLaSGULVYFpXtSKQJsgc7qpHvXDHfx/exec';
        return this._fetchData(REVIEWS_API_URL);
    }

    static async _fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
            const data = await response.json();
            
            if (!data.success) throw new Error(data.error || 'Invalid data format');
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    // Helper function for JSONP requests if needed
    static fetchWithJSONP(url, callbackName) {
        return new Promise((resolve, reject) => {
            window[callbackName] = function(data) {
                resolve(data);
                delete window[callbackName];
            };

            const script = document.createElement('script');
            script.src = `${url}?callback=${callbackName}`;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}