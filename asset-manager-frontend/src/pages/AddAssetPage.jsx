import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
  IconButton,
  CssBaseline,
  Switch,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createAsset, fetchCategories, fetchStatuses } from '../services/assetService';
import { fetchUsers } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Layout from '../components/Layout';
import AssetForm from '../components/AssetForm';

function AddAssetPage() {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Container maxWidth="md" sx={{ mt: 6 }}>
          {/* Dark Mode Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
              color="default"
            />
            <Brightness4Icon sx={{ ml: 1 }} />
          </Box>

          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
              color: theme.palette.text.primary,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              fontWeight={600}
              sx={{
                color: theme.palette.mode === 'dark' ? '#fdd835' : 'primary.main',
              }}
            >
              Add New Asset
            </Typography>

            <Divider
              sx={{
                my: 2,
                borderColor: theme.palette.mode === 'dark' ? '#555' : 'divider',
              }}
            />

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
    </ThemeProvider>
  );
}

export default AddAssetPage;
