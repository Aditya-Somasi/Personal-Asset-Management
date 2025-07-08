import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddAssetPage from './pages/AddAssetPage';
import EditAssetPage from './pages/EditAssetPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import UsersPage from './pages/UsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import HomePage from './pages/HomePage';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useMemo } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', newValue);
      return newValue;
    });
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none' },
        },
      },
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/users" element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <UsersPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              } />
              <Route path="/add-asset" element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AddAssetPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              } />
              <Route path="/edit-asset/:id" element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <EditAssetPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              } />
              <Route path="/admin-settings" element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AdminSettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              } />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
