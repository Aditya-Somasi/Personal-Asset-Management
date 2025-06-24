import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Dialog,
  DialogActions, DialogContent, DialogTitle, Snackbar, Alert
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
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Manage Statuses</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Add Status
      </Button>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statuses.map(status => (
                <TableRow key={status.id}>
                  <TableCell>{status.id}</TableCell>
                  <TableCell>{status.name}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleOpenDialog(status)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(status.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {statuses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">No statuses found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingStatus ? 'Edit Status' : 'Add Status'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Status Name"
            fullWidth
            variant="standard"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{editingStatus ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')}>
        <Alert severity="success" onClose={() => setSuccessMsg('')}>{successMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}

export default StatusManager;