import { Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function SignalChip({ label, value, showLabel = true }) {
  const isYes = value === true || value === 'YES';

  return (
    <Chip
      icon={isYes
        ? <CheckCircleOutlineIcon sx={{ fontSize: '0.9rem', color: '#4caf50 !important' }} />
        : <CancelOutlinedIcon sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3) !important' }} />
      }
      label={showLabel ? label : (isYes ? 'YES' : 'NO')}
      size="small"
      variant="outlined"
      sx={{
        borderColor: isYes ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)',
        color: isYes ? '#4caf50' : 'rgba(255,255,255,0.4)',
        fontSize: '0.75rem',
        '& .MuiChip-icon': { ml: '6px' },
      }}
    />
  );
}
