import axios from 'axios';

export const shareByEmail = async (clientId, documentUrl) => {
  const response = await axios.post('/api/share/email', { clientId, documentUrl });
  return response.data;
};

export const shareByWhatsApp = async (clientId, documentUrl) => {
  const response = await axios.post('/api/share/whatsapp', { clientId, documentUrl });
  return response.data;
};

export const shareBySMS = async (clientId, documentUrl) => {
  const response = await axios.post('/api/share/sms', { clientId, documentUrl });
  return response.data;
};