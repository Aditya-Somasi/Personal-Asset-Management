import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';


const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error('404 Error: Attempted to access', location.pathname);
  }, [location.pathname]);

  return (
    
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <Typography variant="h2" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Oops! Page not found
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          The page you are looking does not exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
          Return to Login
        </Button>
      </Box>
  
  );
};

export default NotFoundPage;
