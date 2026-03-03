import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          pb: { xs: '80px', md: 3 },
          maxWidth: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
