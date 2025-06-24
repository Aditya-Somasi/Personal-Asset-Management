import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSettingsPage from './pages/AdminSettingsPage';


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddAssetPage from './pages/AddAssetPage';
import EditAssetPage from './pages/EditAssetPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import UsersPage from './pages/UsersPage';

const theme = createTheme({
  palette: {
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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <UsersPage />
              </ProtectedRoute>
            } />

            <Route path="/add-asset" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AddAssetPage />
              </ProtectedRoute>
            } />

            <Route path="/edit-asset/:id" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <EditAssetPage />
              </ProtectedRoute>
            } />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="*" element={<NotFoundPage />} />
            <Route path="/admin-settings" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminSettingsPage />
              </ProtectedRoute>
            } />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
