import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your server URL
});

export const uploadDocument = (formData) => {
  return api.post('/upload', formData);
};

export const shareByEmail = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/email', { clientId, documentUrl, messageTemplate });
};

export const shareByWhatsApp = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/whatsapp', { clientId, documentUrl, messageTemplate });
};

export const shareBySMS = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/sms', { clientId, documentUrl, messageTemplate });
};

export const shareAll = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/all', { clientId, documentUrl, messageTemplate });
};

export const checkWhatsAppStatus = (messageSid) => {
  return api.post('/get-status', { messageSid });
};

export default api;
