import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/UserContext';
import authService from './services/auth';
import apiService from './services/api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUser();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = authService.getToken();
        const savedUser = authService.getUser();

        if (token && savedUser?.id) {
          // Fetch full user profile including file URLs
          const response = await apiService.getClientById(savedUser.id);
          console.log('Response from getClientById:', response);
          
          const clientData = response.data || response;
          const fullUserData = {
            id: savedUser.id,
            email: savedUser.email,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            stampUrl: clientData?.stampUrl || null,
            logoUrl: clientData?.logoUrl || null,
          };

          console.log('Full user data:', fullUserData);
          // Store in context
          setUser(fullUserData);
        }
      } catch (err) {
        console.error('Failed to initialize user:', err);
        // Clear auth on error
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setUser]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#121212',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to home or login based on auth */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
