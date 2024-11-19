import api from './api';

export const shareByEmail = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/email', { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};

export const shareByWhatsApp = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/whatsapp', { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};

export const shareBySMS = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/sms', { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};

export const shareAll = (clientId, documentUrl, messageTemplate) => {
  return api.post('/share/all', { 
    clientId, 
    documentUrl,
    messageTemplate: localStorage.getItem('messageTemplate')
  });
};
