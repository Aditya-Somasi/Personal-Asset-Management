import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  TablePagination, Button, CircularProgress,
  Snackbar, Alert, Box, IconButton, Tooltip, TextField, Chip,
  MenuItem, ThemeProvider, createTheme, CssBaseline, Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem('token');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: `'Segoe UI', 'Roboto', sans-serif`,
    }
  });

  const fetchAssets = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyAssets(token, page, rowsPerPage);
      setAssets(data);
    } catch (err) {
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
      } catch {
        setError('Failed to decode token');
      }
    }
  }, [fetchAssets, token]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => window.location.href = `/edit-asset/${id}`;
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteAsset(id, token);
      setAssets(prev => ({
        ...prev,
        content: prev.content.filter(a => a.id !== id)
      }));
      setSuccessMessage('Asset deleted successfully');
    } catch {
      setError('Failed to delete asset');
    }
  };

  const filteredAssets = assets.content.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? asset.category === categoryFilter : true;
    const matchesStatus = statusFilter ? asset.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {/* Dark Mode Toggle */}
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

          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Inventory2OutlinedIcon fontSize="large" sx={{ color: 'primary.main' }} />
            My Assets
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                label="Search by Name"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Filter by Category"
                select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {[...new Set(assets.content.map(a => a.category))].map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Filter by Status"
                select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {[...new Set(assets.content.map(a => a.status))].map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Box>

            {userRole === 'ROLE_ADMIN' && (
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                href="/add-asset"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  borderRadius: 2,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  height: 40
                }}
              >
                Add Asset
              </Button>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <CircularProgress size={48} />
            </Box>
          ) : filteredAssets.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No assets match your criteria.
              </Typography>
            </Box>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: 3 }}>
              <TableContainer sx={{ overflowX: 'auto', borderRadius: 3 }}>
                <Table sx={{ minWidth: 1000 }} size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#ffeb3b' : '#2196f3' }}>
                      {['Name', 'Description', 'Cost', 'Category', 'Status', 'Purchase Date', 'Warranty Expiry', 'Image', 'Actions', 'Assigned To']
                        .filter(header => userRole === 'ROLE_ADMIN' || header !== 'Actions')
                        .map(header => (
                          <TableCell
                            key={header}
                            sx={{
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: 'divider',
                              color: theme.palette.mode === 'dark' ? '#000' : '#fff'
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAssets.map((asset, index) => (
                      <TableRow
                        key={asset.id}
                        sx={{
                          bgcolor: index % 2 === 0 ? 'background.default' : 'background.paper',
                          '&:hover': { bgcolor: 'action.hover' },
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>{asset.name}</TableCell>
                        <Tooltip title={asset.description}>
                          <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', border: '1px solid', borderColor: 'divider' }}>
                            {asset.description}
                          </TableCell>
                        </Tooltip>
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>₹{asset.cost}</TableCell>
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>{asset.category}</TableCell>
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>
                          <Chip
                            label={asset.status}
                            color={
                              asset.status === 'ASSIGNED' ? 'primary' :
                              asset.status === 'AVAILABLE' ? 'success' :
                              asset.status === 'REPAIR' ? 'warning' : 'default'
                            }
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>{asset.purchaseDate}</TableCell>
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>{asset.warrantyExpiryDate || "N/A"}</TableCell>
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>
                          {asset.assetImageUrl ? (
                            <Box
                              component="img"
                              src={asset.assetImageUrl}
                              alt={asset.name}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 2,
                                border: '1px solid #ccc'
                              }}
                            />
                          ) : "N/A"}
                        </TableCell>
                        {userRole === 'ROLE_ADMIN' && (
                          <TableCell sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <Tooltip title="Edit">
                              <IconButton color="primary" onClick={() => handleEdit(asset.id)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton color="error" onClick={() => handleDelete(asset.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}
                        <TableCell sx={{ border: '1px solid', borderColor: 'divider', maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {asset.assignedTo}
                        </TableCell>
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
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  px: 2,
                  bgcolor: theme.palette.mode === 'light' ? '#f9fafb' : 'background.paper',
                  '& .MuiTablePagination-selectLabel': { fontSize: '0.875rem' },
                  '& .MuiTablePagination-displayedRows': { fontSize: '0.875rem' }
                }}
              />
            </Paper>
          )}

          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success" variant="filled">
              {successMessage}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!error}
            autoHideDuration={4000}
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={() => setError('')} severity="error" variant="filled">
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default Dashboard;
