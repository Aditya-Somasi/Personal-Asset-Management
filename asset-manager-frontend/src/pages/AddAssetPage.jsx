import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { createAsset, fetchCategories, fetchStatuses } from '../services/assetService';
import { fetchUsers } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode}  from 'jwt-decode';
import Layout from '../components/Layout';
import AssetForm from '../components/AssetForm';

function AddAssetPage() {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        const [cats, stats] = await Promise.all([
          fetchCategories(token),
          fetchStatuses(token),
        ]);

        setCategories(cats);
        setStatuses(stats);

        if (decoded.role === 'ROLE_ADMIN') {
          const userList = await fetchUsers(token);
          setUsers(userList);
        }
      } catch (err) {
        console.error('Failed to load categories/statuses/users:', err);
      }
    };

    if (token) fetchData();
  }, [token]);

  // ✅ Submit handler passed to AssetForm
  const handleAddAsset = async (formData) => {
    await createAsset(formData, token);
    navigate('/dashboard');
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Asset</Typography>
        <AssetForm
          initialData={{}}
          onSubmit={handleAddAsset}
          userRole={userRole}
          users={users}
          categories={categories}
          statuses={statuses}
          isEdit={false}
        />
      </Container>
    </Layout>
  );
}

export default AddAssetPage;
