import data from '../../db.json';
const API = {
  get: async (url) => {
    const cleanKey = url.replace(/^\//, '').split('?')[0];
    const result = data[cleanKey] || [];
    return { data: result };
  },
  
  post: async (url, payload) => {
    const cleanKey = url.replace(/^\//, '');
    if (data[cleanKey]) {
      const newItem = { ...payload, id: payload.id || Date.now().toString() };
      data[cleanKey].push(newItem);
      return { data: newItem };
    }
    return { data: payload };
  },

  put: async (url, payload) => {
    return { data: payload };
  },

  delete: async (url) => {
    return { data: { success: true } };
  }
};

export default API;