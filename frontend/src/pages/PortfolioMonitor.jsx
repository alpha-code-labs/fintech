import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Button,
  Collapse, IconButton, LinearProgress
} from '@mui/material';
import {
  AccountBalance, Shield, Warning, ErrorOutline,
  KeyboardArrowDown, KeyboardArrowUp, TrendingUp, PieChart
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getPortfolio } from '../services/api';
import {
  PageHeader, ChangeIndicator, StatusBadge, SectionTitle,
  ErrorBanner, EmptyState
} from '../components/common';
import { SkeletonPage } from '../components/common/LoadingSkeleton';

export default function PortfolioMonitor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    getPortfolio()
      .then(setData)
      .catch(() => setError('Failed to load portfolio data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <SkeletonPage />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;
  if (!data) return null;

  const { healthy = [], warning = [], alert = [] } = data.holdings;

  return (
    <Box>
      <PageHeader
        title="Portfolio Monitor"
        subtitle="Your exit signal tracker"
        right={
          <Chip label={`${data.total_holdings} Active Holdings`} size="small" sx={{ fontWeight: 500 }} />
        }
      />

      {/* Portfolio Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Portfolio Value</Typography>
              <Typography variant="h5" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                ₹{(data.portfolio_value / 100000).toFixed(1)}L
              </Typography>
              <Typography variant="caption">{data.total_holdings} stocks</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Total P&L</Typography>
              <Typography variant="h5" sx={{ color: data.total_pnl >= 0 ? 'success.main' : 'error.main', fontVariantNumeric: 'tabular-nums' }}>
                {data.total_pnl >= 0 ? '+' : ''}₹{(data.total_pnl / 100000).toFixed(1)}L
              </Typography>
              <ChangeIndicator value={data.total_pnl_pct} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Healthy</Typography>
              <Typography variant="h5" sx={{ color: 'success.main' }}>{healthy.length}</Typography>
              <Typography variant="caption">No exit signals</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Need Attention</Typography>
              <Typography variant="h5" sx={{ color: warning.length + alert.length > 0 ? 'warning.main' : 'success.main' }}>
                {warning.length + alert.length}
              </Typography>
              <Typography variant="caption">{warning.length} watch, {alert.length} alert</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Portfolio Health Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 1 }}>Portfolio Health</Typography>
          <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ width: `${(healthy.length / data.total_holdings) * 100}%`, bgcolor: 'success.main', transition: 'width 0.5s' }} />
            <Box sx={{ width: `${(warning.length / data.total_holdings) * 100}%`, bgcolor: 'warning.main', transition: 'width 0.5s' }} />
            <Box sx={{ width: `${(alert.length / data.total_holdings) * 100}%`, bgcolor: 'error.main', transition: 'width 0.5s' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            <LegendItem color="#4caf50" label={`Healthy (${healthy.length})`} />
            <LegendItem color="#ff9800" label={`Watch (${warning.length})`} />
            <LegendItem color="#f44336" label={`Alert (${alert.length})`} />
          </Box>
        </CardContent>
      </Card>

      {/* Alert Holdings */}
      {alert.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <SectionTitle icon={ErrorOutline}>
            <Box component="span" sx={{ color: 'error.main' }}>Alert — Review Now</Box>
          </SectionTitle>
          {alert.map((h) => (
            <HoldingCard key={h.symbol} holding={h} status="alert" />
          ))}
        </Box>
      )}

      {/* Warning Holdings */}
      {warning.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <SectionTitle icon={Warning}>
            <Box component="span" sx={{ color: 'warning.main' }}>Warning — Early Signals</Box>
          </SectionTitle>
          {warning.map((h) => (
            <HoldingCard key={h.symbol} holding={h} status="warning" />
          ))}
        </Box>
      )}

      {/* Healthy Holdings */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle icon={Shield}>
          <Box component="span" sx={{ color: 'success.main' }}>Healthy — No Exit Signals</Box>
        </SectionTitle>
        {healthy.length === 0 ? (
          <EmptyState message="No healthy holdings" />
        ) : (
          <Card>
            <CardContent sx={{ p: 0 }}>
              {healthy.map((h, i) => (
                <HoldingRow key={h.symbol} holding={h} isLast={i === healthy.length - 1} />
              ))}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Sector Concentration + Market Leverage */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle icon={PieChart}>Sector Concentration</SectionTitle>
          <Card>
            <CardContent>
              {data.sector_concentration.map((s) => (
                <Box key={s.sector} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{s.sector}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.count} stocks ({s.pct}%)</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={s.pct}
                    sx={{
                      height: 6, borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.06)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: s.pct > 25 ? 'warning.main' : 'primary.main',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle icon={TrendingUp}>Market Leverage</SectionTitle>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 1 }}>Market-wide Margin Borrowing</Typography>
              <Typography variant="h5" sx={{ fontVariantNumeric: 'tabular-nums', mb: 0.5 }}>
                ₹{(data.market_leverage.margin_borrowing_cr / 1000).toFixed(0)}K Cr
              </Typography>
              <Chip
                label={`3-month trend: ${data.market_leverage.trend_3m}`}
                size="small"
                sx={{
                  fontWeight: 600, fontSize: '0.7rem',
                  bgcolor: data.market_leverage.trend_3m === 'INCREASING' ? 'rgba(255,152,0,0.12)' : 'rgba(76,175,80,0.12)',
                  color: data.market_leverage.trend_3m === 'INCREASING' ? 'warning.main' : 'success.main',
                }}
              />
              {data.market_leverage.trend_3m === 'INCREASING' && (
                <Box sx={{ mt: 1.5, p: 1, borderRadius: 1, bgcolor: 'rgba(255,152,0,0.06)', border: '1px solid rgba(255,152,0,0.15)' }}>
                  <Typography variant="caption" sx={{ color: 'warning.main' }}>
                    Rising margin borrowing can indicate excessive leverage in the market
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function HoldingCard({ holding, status }) {
  const [open, setOpen] = useState(status === 'alert');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const borderColor = status === 'alert' ? 'rgba(244,67,54,0.25)' : 'rgba(255,152,0,0.2)';

  return (
    <Card sx={{ mb: 1.5, borderColor }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StatusBadge status={status} />
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{holding.name}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.3 }}>
                <Chip label={holding.symbol} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.06)' }} />
                <Chip label={holding.sector} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.06)' }} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>₹{holding.current_price}</Typography>
              <ChangeIndicator value={holding.pnl_pct} fontSize="0.8rem" />
            </Box>
            <IconButton size="small">
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
        </Box>
        <Collapse in={open}>
          <Box sx={{ mt: 2, pl: 1 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
              <MiniStat label="Bought at" value={`₹${holding.buy_price}`} />
              <MiniStat label="Current" value={`₹${holding.current_price}`} />
              <MiniStat label="P&L" value={`${holding.pnl_pct > 0 ? '+' : ''}${holding.pnl_pct}%`} color={holding.pnl_pct >= 0 ? 'success.main' : 'error.main'} />
              <MiniStat label="Held" value={`${holding.held_months} months`} />
            </Box>
            {holding.signals.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 1 }}>Exit Signals Detected</Typography>
                {holding.signals.map((sig, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                    <ErrorOutline sx={{ fontSize: '0.85rem', color: status === 'alert' ? 'error.main' : 'warning.main', mt: 0.2 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{sig}</Typography>
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {status === 'alert' && (
                <Button size="small" variant="contained" color="error"
                  onClick={() => enqueueSnackbar(`Sell order noted for ${holding.name}`, { variant: 'info' })}>
                  Sell
                </Button>
              )}
              <Button size="small" variant="outlined" color="inherit"
                onClick={() => enqueueSnackbar(`Holding ${holding.name} — noted`, { variant: 'info' })}>
                Hold — I see something different
              </Button>
              <Button size="small" variant="text" onClick={() => navigate(`/stock/${holding.symbol}`)}>
                View Details
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

function HoldingRow({ holding, isLast }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 2.5, py: 1.5,
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer', transition: 'background-color 0.15s',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
      }}
      onClick={() => navigate(`/stock/${holding.symbol}`)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <StatusBadge status="ok" />
        <Box>
          <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{holding.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{holding.sector}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="caption">Bought</Typography>
          <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem' }}>₹{holding.buy_price}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption">Current</Typography>
          <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem' }}>₹{holding.current_price}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right', minWidth: 60 }}>
          <ChangeIndicator value={holding.pnl_pct} />
        </Box>
        <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' }, minWidth: 40, textAlign: 'right' }}>
          {holding.held_months}mo
        </Typography>
      </Box>
    </Box>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <Box>
      <Typography variant="caption">{label}</Typography>
      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: color || 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
    </Box>
  );
}

function LegendItem({ color, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}
