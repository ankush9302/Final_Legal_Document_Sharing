import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your server URL
});

export const uploadDocument = (formData) => {
  return api.post('/upload', formData);
};

export const shareByEmail = (clientId, documentUrl) => {
  return api.post('/share/email', { clientId, documentUrl });
};

export const shareByWhatsApp = (clientId, documentUrl) => {
  return api.post('/share/whatsapp', { clientId, documentUrl });
};

export const shareBySMS = (clientId, documentUrl) => {
  return api.post('/share/sms', { clientId, documentUrl });
};

export const checkWhatsAppStatus = (messageSid) => {
  return api.post('/get-status', { messageSid });
};

export default api;
