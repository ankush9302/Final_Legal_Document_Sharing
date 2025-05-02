const BASE_URL = process.env.NODE_ENV === 'production' ? "http://3.108.234.81:5000" : "http://localhost:5000";

export const API_ENDPOINTS = {
    
    BASE_URL: BASE_URL,

    getBatches: `${BASE_URL}/api/batch/get-batches`,
    getClients(batchId) {
        return `${BASE_URL}/api/get-clients/${batchId}`;
    },
    login : `${BASE_URL}/api/auth/login`,
    register : `${BASE_URL}/api/auth/register`,
    getReport(batchId) {
        return `${BASE_URL}/api/reports/${batchId}/getreport`;
    },



}