import React, { useState } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Layout from '../components/Layout';
import CategoryManager from '../pages/CategoryManager';
import StatusManager from '../pages/StatusManager';

function AdminSettingsPage({ darkMode, toggleDarkMode }) {
  const [tab, setTab] = useState(0);
  const token = localStorage.getItem('token');

  const handleChange = (_, newValue) => setTab(newValue);

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Container sx={{ mt: 4 }}>
        {/* Page Title */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
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
                gap: 1,
                minHeight: 48,
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
  );
}

export default AdminSettingsPage;
