const BASE_URL = process.env.REACT_APP_API_URL;


export const API_ENDPOINTS = {
    
    BASE_URL: BASE_URL,

    getBatches: `${BASE_URL}/api/batch/get-batches`,
    getClients(batchId) {
        return `${BASE_URL}/api/get-clients/${batchId}`;
    },
    login : `${BASE_URL}/api/auth/login`,
    register : `${BASE_URL}/api/auth/register`,
    getUserProfile : `${BASE_URL}/api/auth/profile`,
    getReport(batchId) {
        return `${BASE_URL}/api/reports/${batchId}/getreport`;
    },
    shareEntireBatch (batchId) {
        return `${BASE_URL}/api/share/${batchId}/share-entire-batch`
    },
    pdfProcess : `${BASE_URL}/api/pdf-processing/upload`,
}