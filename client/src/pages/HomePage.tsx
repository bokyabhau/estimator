import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import authService from '../services/auth';
import ProfileSection from './ProfileSection';
import FilesSection from './FilesSection';
import ReportsSection from './ReportsSection';

type NavItem = 'profile' | 'files' | 'reports';

interface NavItemConfig {
  id: NavItem;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItemConfig[] = [
  { id: 'profile', label: 'Profile', icon: <PersonIcon /> },
  { id: 'files', label: 'Files', icon: <FolderIcon /> },
  { id: 'reports', label: 'Reports', icon: <BarChartIcon /> },
];

const drawerWidth = 280;

export default function HomePage() {
  const [selectedNav, setSelectedNav] = useState<NavItem>('profile');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const renderDetailsView = () => {
    switch (selectedNav) {
      case 'profile':
        return <ProfileSection />;
      case 'files':
        return <FilesSection />;
      case 'reports':
        return <ReportsSection />;
      default:
        return null;
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Navigation
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflow: 'auto', padding: 0, margin: 0 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={selectedNav === item.id}
            onClick={() => {
              setSelectedNav(item.id);
              if (isSmallScreen) {
                setMobileDrawerOpen(false);
              }
            }}
            sx={{
              padding: '12px 16px',
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ padding: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* AppBar */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isSmallScreen && (
            <Button
              color="inherit"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              sx={{ marginRight: 2 }}
            >
              {mobileDrawerOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              flex: isSmallScreen ? 1 : 'unset',
            }}
          >
            Estimator Pro
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Navigation */}
        {isSmallScreen ? (
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Box
            sx={{
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              display: 'flex',
            }}
          >
            {drawerContent}
          </Box>
        )}

        {/* Details View */}
        <Box
          sx={{
            flex: 1,
            padding: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            overflowY: 'auto',
          }}
        >
          {renderDetailsView()}
        </Box>
      </Box>
    </Box>
  );
}
