import api from './api';

export const shareByEmail = (clientId, documentUrl) => {
  return api.post('/share/email', { clientId, documentUrl });
};

export const shareByWhatsApp = (clientId, documentUrl) => {
  return api.post('/share/whatsapp', { clientId, documentUrl });
};

export const shareBySMS = (clientId, documentUrl) => {
  return api.post('/share/sms', { clientId, documentUrl });
};