import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Collapse, Grid, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  KeyboardArrowDown, KeyboardArrowUp, OpenInNew, Sort
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getScanner } from '../services/api';
import {
  PageHeader, ScoreBadge, ChangeIndicator, SignalChip,
  SectionTitle, ErrorBanner, EmptyState
} from '../components/common';
import { SkeletonPage } from '../components/common/LoadingSkeleton';

export default function SignalScanner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('score');

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    getScanner()
      .then(setData)
      .catch(() => setError('Failed to load scanner data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <SkeletonPage />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;
  if (!data) return null;

  const sortedSignals = [...data.signals].sort((a, b) => {
    switch (sortBy) {
      case 'score': return b.score - a.score;
      case 'volume': return b.vol_vs_avg - a.vol_vs_avg;
      case 'change': return b.change_pct - a.change_pct;
      case 'delivery': return b.delivery_pct - a.delivery_pct;
      default: return b.score - a.score;
    }
  });

  return (
    <Box>
      <PageHeader
        title="Signal Scanner"
        subtitle="Your weekly volume + price scan — automated"
        right={
          <Chip label={`Week ending: ${data.week_ending}`} size="small" sx={{ fontWeight: 500 }} />
        }
      />

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Stocks Scanned</Typography>
              <Typography variant="h5">{data.stocks_scanned.toLocaleString()}</Typography>
              <Typography variant="caption">above 500 Cr market cap</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Stocks Triggered</Typography>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>{data.stocks_triggered}</Typography>
              <Typography variant="caption">passed all 3 filters</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Hit Rate</Typography>
              <Typography variant="h5">{((data.stocks_triggered / data.stocks_scanned) * 100).toFixed(1)}%</Typography>
              <Typography variant="caption">of total universe</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>Top Score</Typography>
              <Typography variant="h5" sx={{ color: 'success.main' }}>
                {Math.max(...data.signals.map(s => s.score))}/8
              </Typography>
              <Typography variant="caption">highest this week</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sort Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Sort sx={{ fontSize: '1rem', color: 'text.secondary' }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>Sort by:</Typography>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={(_, val) => val && setSortBy(val)}
          size="small"
        >
          <ToggleButton value="score" sx={toggleSx}>Score</ToggleButton>
          <ToggleButton value="volume" sx={toggleSx}>Volume</ToggleButton>
          <ToggleButton value="change" sx={toggleSx}>Price Change</ToggleButton>
          <ToggleButton value="delivery" sx={toggleSx}>Delivery %</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Signals Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                <TableCell>Stock</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell align="right">Vol vs Avg</TableCell>
                <TableCell align="right">Delivery %</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell width={40} />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSignals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <EmptyState message="No stocks triggered this week" />
                  </TableCell>
                </TableRow>
              ) : (
                sortedSignals.map((stock) => (
                  <StockRow key={stock.symbol} stock={stock} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Gates Explanation */}
      <Card sx={{ mt: 3, borderColor: 'rgba(79,195,247,0.15)' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 1 }}>
            How stocks appear here — 3 gates (must pass all)
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Weekly Vol >= 5x avg" size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            <Chip label="Price up >= 5%" size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            <Chip label="Delivery % high" size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

const toggleSx = {
  fontSize: '0.7rem', py: 0.5, px: 1.5, textTransform: 'none',
  borderColor: 'rgba(255,255,255,0.1)',
  '&.Mui-selected': { bgcolor: 'rgba(79,195,247,0.12)', color: 'primary.main' },
};

function StockRow({ stock }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <TableRow
        hover
        sx={{
          cursor: 'pointer',
          '& td': { borderBottom: open ? 'none' : undefined },
          transition: 'background-color 0.15s',
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{stock.name}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3 }}>
              <Chip label={stock.symbol} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.06)' }} />
              <Chip label={stock.sector} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.06)' }} />
            </Box>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Typography sx={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>₹{stock.price}</Typography>
        </TableCell>
        <TableCell align="right">
          <ChangeIndicator value={stock.change_pct} />
        </TableCell>
        <TableCell align="right">
          <Typography sx={{ fontWeight: 600, color: stock.vol_vs_avg >= 7 ? 'primary.main' : 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
            {stock.vol_vs_avg}x
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography sx={{
            fontVariantNumeric: 'tabular-nums',
            color: stock.delivery_pct >= 60 ? 'success.main' : stock.delivery_pct >= 50 ? 'text.primary' : 'warning.main',
            fontWeight: 500,
          }}>
            {stock.delivery_pct}%
          </Typography>
        </TableCell>
        <TableCell align="center">
          <ScoreBadge score={stock.score} size="small" />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); navigate(`/stock/${stock.symbol}`); }}
            sx={{ color: 'primary.main' }}
          >
            <OpenInNew sx={{ fontSize: '1rem' }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ py: 0, px: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, pl: 7, bgcolor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 1 }}>Technical Signals</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    <SignalRow label="Above 30W MA" value={stock.signals.above_30w_ma} />
                    <SignalRow label="Above 52W MA" value={stock.signals.above_52w_ma} />
                    <SignalRow label="Golden Cross" value={!!stock.signals.golden_cross} detail={stock.signals.golden_cross || 'No'} />
                    <SignalRow label="RS vs Nifty (4W)" value={stock.signals.rs_vs_nifty_4w > 0} detail={`${stock.signals.rs_vs_nifty_4w > 0 ? '+' : ''}${stock.signals.rs_vs_nifty_4w}%`} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 1 }}>Context</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    <SignalRow label="Consolidation breakout" value={stock.signals.consolidation_months >= 6} detail={`${stock.signals.consolidation_months} months`} />
                    <SignalRow label="Sector strong" value={stock.signals.sector_strong} />
                    <SignalRow label="Peers triggered" value={stock.signals.peers_triggered >= 2} detail={stock.signals.peers_triggered > 0 ? `${stock.signals.peers_triggered} peers` : 'None'} />
                  </Box>
                  {stock.delivery_pct < 50 && (
                    <Box sx={{ mt: 1.5, p: 1, borderRadius: 1, bgcolor: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.2)' }}>
                      <Typography variant="caption" sx={{ color: 'warning.main' }}>
                        Delivery at {stock.delivery_pct}% — possibly speculative
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function SignalRow({ label, value, detail }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <SignalChip label={label} value={value} />
      {detail && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{detail}</Typography>
      )}
    </Box>
  );
}
