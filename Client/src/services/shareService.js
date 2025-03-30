import api from './api';

export const shareByEmail = (clientId, documentUrl, messageTemplate , batchId) => {
  return api.post(`/share/${batchId}/email`, { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};

export const shareByWhatsApp = (clientId, documentUrl, messageTemplate, batchId) => {
  return api.post(`/share/${batchId}/whatsapp`, { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};

export const shareBySMS = (clientId, documentUrl, messageTemplate, batchId) => {
  return api.post(`/share/${batchId}/sms`, { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};

export const shareAll = (clientId, documentUrl, messageTemplate , batchId) => {
  return api.post(`/share/${batchId}/all`, { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};
