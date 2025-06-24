// AdminSettingsPage.jsx
import React, { useState } from 'react';
import {
  Container, Typography, Tabs, Tab, Box, Divider
} from '@mui/material';
import Layout from '../components/Layout';
import CategoryManager from '../pages/CategoryManager';
import StatusManager from '../pages/StatusManager';


function AdminSettingsPage() {
  const [tab, setTab] = useState(0);
  const token = localStorage.getItem('token');

  const handleChange = (_, newValue) => setTab(newValue);

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Admin Panel – Categories & Statuses
        </Typography>

        <Tabs value={tab} onChange={handleChange} sx={{ mb: 2 }}>
          <Tab label="Asset Categories" />
          <Tab label="Asset Statuses" />
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        <Box hidden={tab !== 0}>
          <CategoryManager token={token} />
        </Box>
        <Box hidden={tab !== 1}>
          <StatusManager token={token} />
        </Box>
      </Container>
    </Layout>
  );
}

export default AdminSettingsPage;
