import { Box, Button, Paper, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function ReportsSection() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 3 }}>
        Reports
      </Typography>
      <Paper
        sx={{
          padding: 3,
          textAlign: 'center',
          backgroundColor: 'rgba(76, 175, 80, 0.05)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
        }}
      >
        <BarChartIcon sx={{ fontSize: 48, color: 'success.main', marginBottom: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>
          No Reports Generated
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
          Reports will appear here once you generate them. Create your first report now.
        </Typography>
        <Button variant="contained" color="success">
          Generate Report
        </Button>
      </Paper>
    </Box>
  );
}
