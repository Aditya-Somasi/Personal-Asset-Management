import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';

import {
  fetchStatuses as fetchStatusesFromApi,
  createStatus,
  updateStatus,
  deleteStatus
} from '../services/assetService';

function StatusManager({ token }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusName, setStatusName] = useState('');

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStatusesFromApi(token);
      setStatuses(data);
    } catch (err) {
      setError('Failed to load statuses');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleOpenDialog = (status = null) => {
    setEditingStatus(status);
    setStatusName(status ? status.name : '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setStatusName('');
    setEditingStatus(null);
  };

  const handleSave = async () => {
    if (!statusName.trim()) {
      setError('Status name cannot be empty');
      return;
    }
    try {
      if (editingStatus) {
        await updateStatus(editingStatus.id, statusName.trim(), token);
        setSuccessMsg('Status updated successfully');
      } else {
        await createStatus(statusName.trim(), token);
        setSuccessMsg('Status created successfully');
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError('Failed to save status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return;
    try {
      await deleteStatus(id, token);
      setSuccessMsg('Status deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete status');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        🚦 Manage Statuses
      </Typography>

      <Button
        variant="contained"
        onClick={() => handleOpenDialog()}
        sx={{
          borderRadius: 2,
          mb: 2,
          textTransform: 'none',
          fontWeight: 'bold',
          backgroundColor: isDark ? '#FFD700' : '#1976d2',
          color: isDark ? '#000' : '#fff',
          '&:hover': {
            backgroundColor: isDark ? '#facc15' : '#1565c0',
          },
        }}
      >
        ➕ Add Status
      </Button>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: isDark ? '#FFD700' : '#1976d2' }}>
                <TableCell sx={{ color: isDark ? '#000' : '#fff', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: isDark ? '#000' : '#fff', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell align="right" sx={{ color: isDark ? '#000' : '#fff', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statuses.map((status) => (
                <TableRow
                  key={status.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: isDark ? '#333' : '#f1f1f1',
                    },
                  }}
                >
                  <TableCell>{status.id}</TableCell>
                  <TableCell>{status.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog(status)}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        px: 2,
                        py: 0.8,
                        mr: 2,
                        borderRadius: 2,
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(status.id)}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        px: 2.5,
                        py: 0.8,
                        borderRadius: 2,
                      }}
                    >
                      🗑️ Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {statuses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No statuses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingStatus ? '✏️ Edit Status' : '➕ Add Status'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Status Name"
            fullWidth
            variant="outlined"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingStatus ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StatusManager;
