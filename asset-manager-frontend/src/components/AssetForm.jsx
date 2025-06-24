import React, { useState, useEffect } from 'react';
import {
  TextField, Grid, Button, Select, MenuItem, InputLabel,
  FormControl, Alert, Snackbar, Box
} from '@mui/material';

function AssetForm({
  initialData = {},
  onSubmit,
  userRole,
  users = [],
  categories = [],
  statuses = [],
  isEdit = false,
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    cost: '',
    category: '',
    status: '',
    purchaseDate: '',
    warrantyExpiryDate: '',
    assetImageUrl: '',
    username: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        cost: initialData.cost || '',
        category: initialData.category || '',
        status: initialData.status || '',
        purchaseDate: initialData.purchaseDate || '',
        warrantyExpiryDate: initialData.warrantyExpiryDate || '',
        assetImageUrl: initialData.assetImageUrl || '',
        username: initialData.assignedTo || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'status' && value !== 'ASSIGNED') {
      setForm(prev => ({ ...prev, [name]: value, username: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(form);
      setSuccessMessage(isEdit ? 'Asset updated successfully!' : 'Asset added successfully!');
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Submission failed. Check console for details.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Cost (₹)" name="cost" type="number" value={form.cost} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select name="category" value={form.category} onChange={handleChange} label="Category">
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} onChange={handleChange} label="Status">
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.name}>{status.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {userRole === 'ROLE_ADMIN' && form.status === 'ASSIGNED' && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Assign To User</InputLabel>
              <Select name="username" value={form.username} onChange={handleChange} label="Assign To User">
                {users.map(user => (
                  <MenuItem key={user.username} value={user.username}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Warranty Expiry Date"
            name="warrantyExpiryDate"
            type="date"
            value={form.warrantyExpiryDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Image URL"
            name="assetImageUrl"
            value={form.assetImageUrl}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            {isEdit ? 'Save Changes' : 'Submit'}
          </Button>
        </Grid>
      </Grid>

      {/* Feedback Messages */}
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success">{successMessage}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}

export default AssetForm;
