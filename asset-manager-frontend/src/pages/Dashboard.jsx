import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  TablePagination, Button, CircularProgress, Snackbar, Alert, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { jwtDecode } from 'jwt-decode';
import { getMyAssets, deleteAsset } from '../services/assetService';
import Layout from '../components/Layout'; 

function Dashboard() {
  const [assets, setAssets] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    pageNumber: 0,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchAssets = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyAssets(token, page, rowsPerPage);
      setAssets(data);
    } catch (err) {
      console.error('Failed to fetch assets', err);
      setError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  }, [token, page, rowsPerPage]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        fetchAssets();
      } catch (error) {
        setError('Failed to decode token');
      }
    }
  }, [fetchAssets, token]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    window.location.href = `/edit-asset/${id}`;
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this asset?');
    if (!confirm) return;

    try {
      await deleteAsset(id, token);
      setAssets(prev => ({
        ...prev,
        content: prev.content.filter(a => a.id !== id)
      }));
      setSuccessMessage('Asset deleted successfully');
    } catch (err) {
      console.error("Delete failed", err);
      setError('Failed to delete asset');
    }
  };

  return (
    <Layout> {/* ✅ All content is now inside Layout */}
      <Box sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>My Assets</Typography>
        </Box>

        {userRole === 'ROLE_ADMIN' && (
          <Button
            variant="contained"
            color="primary"
            href="/add-asset"
            sx={{ mb: 2 }}
          >
            Add Asset
          </Button>
        )}

        {loading ? (
          <CircularProgress />
        ) : assets.content.length === 0 ? (
          <Typography>No assets found.</Typography>
        ) : (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Warranty Expiry</TableCell>
                    <TableCell>Image</TableCell>
                    {userRole === 'ROLE_ADMIN' && <TableCell>Actions</TableCell>}
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.content.map(asset => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.description}</TableCell>
                      <TableCell>₹{asset.cost}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.status}</TableCell>
                      <TableCell>{asset.purchaseDate}</TableCell>
                      <TableCell>{asset.warrantyExpiryDate || "N/A"}</TableCell>
                      <TableCell>
                        {asset.assetImageUrl ? (
                          <img src={asset.assetImageUrl} alt={asset.name} width={60} />
                        ) : "N/A"}
                      </TableCell>
                      {userRole === 'ROLE_ADMIN' && (
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(asset.id)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleDelete(asset.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </TableCell>
                      )}
                      <TableCell>{asset.assignedTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={assets.totalElements}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Snackbars */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success">{successMessage}</Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity="error">{error}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}

export default Dashboard;
