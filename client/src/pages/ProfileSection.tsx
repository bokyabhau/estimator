import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';
import authService from '../services/auth';

export default function ProfileSection() {
  const user = authService.getUser();

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 3 }}>
        My Profile
      </Typography>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography color="textSecondary" variant="body2">
              First Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user?.firstName}
            </Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" variant="body2">
              Last Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user?.lastName}
            </Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" variant="body2">
              Email Address
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
