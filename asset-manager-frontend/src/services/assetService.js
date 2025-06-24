import axios from 'axios';

const API_URL = 'http://localhost:8080/api/assets';

export const getMyAssets = async (token, page = 0, size = 5) => {
  const response = await axios.get(`http://localhost:8080/api/assets?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createAsset = async (assetData, token) => {
  const response = await axios.post(API_URL, assetData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const fetchCategories = async (token) => {
  const response = await axios.get('http://localhost:8080/api/admin/categories', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchStatuses = async (token) => {
  const response = await axios.get('http://localhost:8080/api/admin/statuses', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteAsset = async (id, token) => {
  await axios.delete(`http://localhost:8080/api/assets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getAssetById = async (id, token) => {
  const response = await axios.get(`http://localhost:8080/api/assets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateAsset = async (id, updatedAsset, token) => {
  const response = await axios.put(`http://localhost:8080/api/assets/${id}`, updatedAsset, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// ----------- CATEGORY ADMIN APIs ------------

export const createCategory = async (name, token) => {
  const response = await axios.post(
    'http://localhost:8080/api/admin/categories',
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateCategory = async (id, name, token) => {
  const response = await axios.put(
    `http://localhost:8080/api/admin/categories/${id}`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteCategory = async (id, token) => {
  await axios.delete(`http://localhost:8080/api/admin/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ----------- STATUS ADMIN APIs ------------

export const createStatus = async (name, token) => {
  const response = await axios.post(
    'http://localhost:8080/api/admin/statuses',
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateStatus = async (id, name, token) => {
  const response = await axios.put(
    `http://localhost:8080/api/admin/statuses/${id}`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteStatus = async (id, token) => {
  await axios.delete(`http://localhost:8080/api/admin/statuses/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};




