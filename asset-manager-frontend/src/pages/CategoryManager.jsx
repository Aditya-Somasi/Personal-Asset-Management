import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Dialog,
  DialogActions, DialogContent, DialogTitle, Snackbar, Alert,
  useTheme
} from '@mui/material';

import {
  fetchCategories as fetchCategoriesFromApi,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/assetService';

function CategoryManager({ token }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategoriesFromApi(token);
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryName.trim(), token);
        setSuccessMsg('Category updated successfully');
      } else {
        await createCategory(categoryName.trim(), token);
        setSuccessMsg('Category created successfully');
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id, token);
      setSuccessMsg('Category deleted successfully');
      fetchData();
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to delete category');
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        🗂️ Manage Categories
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
        ➕ Add Category
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
              {categories.map((cat) => (
                <TableRow
                  key={cat.id}
                  hover
                  sx={{ '&:hover': { backgroundColor: isDark ? '#333' : '#f1f1f1' } }}
                >
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog(cat)}
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
                      onClick={() => handleDelete(cat.id)}
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
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingCategory ? '✏️ Edit Category' : '➕ Add Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

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
        autoHideDuration={6000}
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

export default CategoryManager;
