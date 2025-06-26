import React, { useState } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  CssBaseline,
  Paper,
  Switch,
  IconButton,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Layout from '../components/Layout';
import CategoryManager from '../pages/CategoryManager';
import StatusManager from '../pages/StatusManager';

function AdminSettingsPage() {
  const [tab, setTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (_, newValue) => setTab(newValue);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f7fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: `'Segoe UI', 'Roboto', sans-serif`,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Container sx={{ mt: 4 }}>
          {/* Dark Mode Toggle with Brightness Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(prev => !prev)}
              color="default"
            />
            <IconButton disabled>
              <Brightness4Icon sx={{ color: 'text.primary' }} />
            </IconButton>
          </Box>

          {/* Page Title */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? '#fdd835' : 'primary.main',
              mb: 3,
            }}
          >
            Admin Settings
          </Typography>

          {/* Tabs */}
          <Paper
            elevation={0}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: 'transparent',
              mb: 2,
            }}
          >
            <Tabs
              value={tab}
              onChange={handleChange}
              TabIndicatorProps={{
                sx: {
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                },
              }}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  px: 3,
                  py: 1.5,
                  color: theme.palette.text.secondary,
                  gap: 1,
                  minHeight: 48,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                },
                '& .Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <Tab icon={<FolderOpenIcon />} iconPosition="start" label="Asset Categories" />
              <Tab icon={<CheckCircleIcon />} iconPosition="start" label="Asset Statuses" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box>
            {tab === 0 && <CategoryManager token={token} />}
            {tab === 1 && <StatusManager token={token} />}
          </Box>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default AdminSettingsPage;
