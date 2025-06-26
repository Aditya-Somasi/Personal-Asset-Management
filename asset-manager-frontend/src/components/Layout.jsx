import React, { useState } from 'react';
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Avatar, Menu, MenuItem, Divider, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const expandedWidth = 240;
const collapsedWidth = 60;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setConfirmLogoutOpen(true);
    handleClose();
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setConfirmLogoutOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['ROLE_ADMIN', 'ROLE_USER'] },
    { text: 'Add Asset', icon: <AddIcon />, path: '/add-asset', roles: ['ROLE_ADMIN'] },
    { text: 'Users', icon: <AccountCircle />, path: '/users', roles: ['ROLE_ADMIN'] },
    { text: 'Admin Settings', icon: <SettingsIcon />, path: '/admin-settings', roles: ['ROLE_ADMIN'] }
  ];

  const drawer = (
    <div>
      <Toolbar
        sx={{
          justifyContent: collapsed ? 'center' : 'space-between',
          px: 2,
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? 'white' : 'black'
            }}
          >
            Options
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => {
            const isSelected = location.pathname === item.path;
            const selectedBg = theme.palette.mode === 'dark' ? '#fdd835' : '#2196f3';
            const selectedHoverBg = theme.palette.mode === 'dark' ? '#fbc02d' : '#1976d2';
            const selectedTextColor = theme.palette.getContrastText(selectedBg);

            return (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <Tooltip title={collapsed ? item.text : ''} placement="right">
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => navigate(item.path)}
                    sx={{
                      justifyContent: collapsed ? 'center' : 'initial',
                      px: 2.5,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: selectedBg,
                        color: selectedTextColor,
                        '& .MuiListItemIcon-root': {
                          color: selectedTextColor
                        },
                        '&:hover': {
                          backgroundColor: selectedHoverBg
                        }
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${collapsed ? collapsedWidth : expandedWidth}px)`,
          ml: `${collapsed ? collapsedWidth : expandedWidth}px`,
          transition: 'all 0.3s ease',
          bgcolor: theme.palette.mode === 'dark' ? '#fdd835' : '#1976d2'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? '#000' : '#fff'
            }}
          >
            Personal Asset Management
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>{user?.name}</Typography>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: collapsed ? collapsedWidth : expandedWidth, flexShrink: 0 }}>
        <Drawer
          variant="permanent"
          open
          sx={{
            '& .MuiDrawer-paper': {
              width: collapsed ? collapsedWidth : expandedWidth,
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              boxSizing: 'border-box'
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${collapsed ? collapsedWidth : expandedWidth}px)`,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Dialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogoutOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmLogout} color="error" variant="contained">Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;
