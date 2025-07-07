import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  CssBaseline,
  Button,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  fetchCategories,
  fetchStatuses,
  getAssetById,
  updateAsset
} from '../services/assetService';
import { fetchUsers } from '../services/userService';
import Layout from '../components/Layout';
import AssetForm from '../components/AssetForm';

function EditAssetPage({ darkMode, toggleDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [initialData, setInitialData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        const [asset, cats, stats] = await Promise.all([
          getAssetById(id, token),
          fetchCategories(token),
          fetchStatuses(token),
        ]);

        const userList = decoded.role === 'ROLE_ADMIN' ? await fetchUsers(token) : [];

        setInitialData({
          ...asset,
          username: asset.assignedTo || '',
          purchaseDate: asset.purchaseDate || '',
          warrantyExpiryDate: asset.warrantyExpiryDate || '',
        });

        setCategories(cats);
        setStatuses(stats);
        setUsers(userList);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load asset, categories, or users.');
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [id, token]);

  const handleUpdateAsset = async (formData) => {
    await updateAsset(id, formData, token);
    navigate('/dashboard');
  };

  if (loading) {
    return (
     <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>

        <Box sx={{ mt: 4, ml: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>

        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      </Layout>
    );
  }

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            startIcon={<ArrowBackIosNewIcon />}
            sx={{
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '1rem',
              px: 3,
              py: 1.2,
              textTransform: 'none',
              backgroundColor: isDark ? '#FFD700' : '#1976d2',
              color: isDark ? '#000' : '#fff',
              '&:hover': {
                backgroundColor: isDark ? '#facc15' : '#1565c0',
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>Edit Asset</Typography>
        <AssetForm
          initialData={initialData}
          onSubmit={handleUpdateAsset}
          userRole={userRole}
          users={users}
          categories={categories}
          statuses={statuses}
          isEdit={true}
        />
      </Container>
    </Layout>
  );
}

export default EditAssetPage;
