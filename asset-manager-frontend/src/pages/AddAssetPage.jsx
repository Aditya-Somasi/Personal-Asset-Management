import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
  Button,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'; // ✅ Imported icon
import { fetchCategories, fetchStatuses, createAsset } from '../services/assetService';
import { fetchUsers } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Layout from '../components/Layout';
import AssetForm from '../components/AssetForm';

function AddAssetPage({ darkMode, toggleDarkMode }) {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleAddAsset = async (formData) => {
    await createAsset(formData, token);
    navigate('/dashboard');
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Container maxWidth="md" sx={{ mt: 6 }}>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            startIcon={<ArrowBackIosNewIcon />} // ✅ Icon here
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

        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            fontWeight={600}
          >
            Add New Asset
          </Typography>

          <Divider sx={{ my: 2 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : (
            <AssetForm
              initialData={{}}
              onSubmit={handleAddAsset}
              userRole={userRole}
              users={users}
              categories={categories}
              statuses={statuses}
              isEdit={false}
            />
          )}
        </Paper>
      </Container>
    </Layout>
  );
}

export default AddAssetPage;
