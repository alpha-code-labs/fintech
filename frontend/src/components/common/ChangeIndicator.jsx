import { Typography, Box } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';

export default function ChangeIndicator({ value, suffix = '%', fontSize = '0.85rem', showIcon = true }) {
  const num = parseFloat(value);
  const isPositive = num > 0;
  const isNegative = num < 0;
  const color = isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary';

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
      {showIcon && (
        isPositive ? <ArrowDropUpIcon sx={{ color, fontSize: '1.2rem', mr: -0.3 }} /> :
        isNegative ? <ArrowDropDownIcon sx={{ color, fontSize: '1.2rem', mr: -0.3 }} /> :
        <RemoveIcon sx={{ color, fontSize: '0.8rem', mr: 0.3 }} />
      )}
      <Typography
        component="span"
        sx={{ color, fontWeight: 600, fontSize, fontVariantNumeric: 'tabular-nums' }}
      >
        {isPositive ? '+' : ''}{num}{suffix}
      </Typography>
    </Box>
  );
}
