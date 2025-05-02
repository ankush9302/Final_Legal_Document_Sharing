const BASE_URL = process.env.REACT_APP_API_URL;


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