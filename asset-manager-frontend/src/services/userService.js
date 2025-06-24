// src/services/userService.js
import axios from 'axios';

export const fetchUsers = async (token) => {
  const response = await axios.get('http://localhost:8080/api/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
