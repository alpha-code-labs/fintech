import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Divider
} from '@mui/material';
import {
  ShowChart, Insights, Groups, BarChart, AutoAwesome,
  Bookmark, AddCircleOutline, Close, Flag,
  CheckCircle, Cancel, HelpOutline
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getStock } from '../services/api';
import {
  PageHeader, ScoreBadge, ChangeIndicator, SectionTitle,
  ErrorBanner
} from '../components/common';
import { SkeletonPage } from '../components/common/LoadingSkeleton';

export default function StockDeepDive() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    getStock(symbol)
      .then(setData)
      .catch(() => setError(`Failed to load data for ${symbol}`))
      .finally(() => setLoading(false));
  }, [symbol]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <SkeletonPage />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;
  if (!data) return null;

  const handleAction = (action) => {
    enqueueSnackbar(`${data.name} ${action}`, { variant: 'success' });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScoreBadge score={data.score} size="large" />
          <Box>
            <Typography variant="h4">{data.name}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              <Chip label={data.symbol} size="small" sx={{ fontWeight: 600 }} />
              <Chip label={data.sector} size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
              <Chip label={`₹${data.market_cap.toLocaleString()} Cr`} size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h4" sx={{ fontVariantNumeric: 'tabular-nums' }}>₹{data.price}</Typography>
        </Box>
      </Box>

      {/* Chart Placeholder */}
      <Card sx={{ mb: 3, borderColor: 'rgba(79,195,247,0.15)' }}>
        <CardContent>
          <Box
            sx={{
              height: 280, borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 1,
            }}
          >
            <ShowChart sx={{ fontSize: 48, color: 'rgba(255,255,255,0.15)' }} />
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Weekly Chart — TradingView integration planned
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Your MAs (10W, 30W, 52W) + volume bars + consolidation zone shaded
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {data.key_levels && Object.entries(data.key_levels).map(([key, val]) => (
                <Chip key={key} label={`${key.replace(/_/g, ' ')}: ₹${val}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', borderColor: 'rgba(79,195,247,0.3)', color: 'primary.main' }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, bgcolor: 'rgba(255,152,0,0.06)', border: '1px solid rgba(255,152,0,0.15)' }}>
            <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 500 }}>
              YOUR JUDGMENT HERE — What pattern is this? Cup & handle? Darvas box? VCP? Is it convincing?
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Technical Signals */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle icon={Insights}>Technical Signals</SectionTitle>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TechRow label="Volume this week" value={`${data.technical.vol_vs_avg}x average`} highlight />
                <TechRow label="Delivery %" value={`${data.technical.delivery_pct}%`} color={data.technical.delivery_pct >= 60 ? 'success.main' : 'warning.main'} />
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />
                <TechRow label="Above 30W MA" value={data.technical.above_30w_ma ? `YES (MA at ₹${data.technical.ma_30w})` : 'NO'} ok={data.technical.above_30w_ma} />
                <TechRow label="Above 52W MA" value={data.technical.above_52w_ma ? `YES (MA at ₹${data.technical.ma_52w})` : 'NO'} ok={data.technical.above_52w_ma} />
                <TechRow label="Golden Cross" value={data.technical.golden_cross || 'No'} ok={!!data.technical.golden_cross} />
                <TechRow label="RS vs Nifty (4W)" value={`${data.technical.rs_vs_nifty_4w > 0 ? '+' : ''}${data.technical.rs_vs_nifty_4w}%`} ok={data.technical.rs_vs_nifty_4w > 0} />
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />
                <TechRow label="Consolidation" value={`${data.technical.consolidation_months} months (₹${data.technical.consolidation_range[0]}–${data.technical.consolidation_range[1]})`} />
                <TechRow label="Breakout above" value={`₹${data.technical.breakout_level}`} color="primary.main" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sector Context */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle icon={Groups}>Sector Context</SectionTitle>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2">{data.sector} sector RS vs Nifty (4W)</Typography>
                <ChangeIndicator value={data.sector_context.sector_rs_vs_nifty_4w} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 1 }}>
                Peers also triggered this week
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Stock</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">Volume</TableCell>
                    <TableCell align="center">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.sector_context.peers_triggered.map((peer) => (
                    <TableRow
                      key={peer.symbol}
                      hover
                      sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                      onClick={() => navigate(`/stock/${peer.symbol}`)}
                    >
                      <TableCell>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{peer.name}</Typography>
                      </TableCell>
                      <TableCell align="right"><ChangeIndicator value={peer.change_pct} /></TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem' }}>{peer.vol_vs_avg}x</Typography>
                      </TableCell>
                      <TableCell align="center"><ScoreBadge score={peer.score} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 1.5, p: 1, borderRadius: 1, bgcolor: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.15)' }}>
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  {data.sector_context.peers_triggered.length} peers triggered — possible sector momentum
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Fundamentals */}
        <Grid size={{ xs: 12 }}>
          <SectionTitle icon={BarChart}>Fundamentals (auto-pulled quarterly data)</SectionTitle>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      {data.fundamentals.quarters.map((q) => (
                        <TableCell key={q.label} align="right">{q.label}</TableCell>
                      ))}
                      <TableCell align="right">YoY Change</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <FundRow label="Revenue (Cr)" field="revenue" quarters={data.fundamentals.quarters} prefix="₹" />
                    <FundRow label="Operating Margin" field="operating_margin" quarters={data.fundamentals.quarters} suffix="%" />
                    <FundRow label="Net Profit (Cr)" field="net_profit" quarters={data.fundamentals.quarters} prefix="₹" />
                    <FundRow label="EPS" field="eps" quarters={data.fundamentals.quarters} prefix="₹" />
                    <FundRow label="Total Debt (Cr)" field="total_debt" quarters={data.fundamentals.quarters} prefix="₹" invertColor />
                    <FundRow label="ROCE" field="roce" quarters={data.fundamentals.quarters} suffix="%" />
                    <FundRow label="Promoter Holding" field="promoter_holding" quarters={data.fundamentals.quarters} suffix="%" />
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Box>
                  <Typography variant="caption">P/E</Typography>
                  <Typography variant="h6" sx={{ fontVariantNumeric: 'tabular-nums' }}>{data.fundamentals.pe}x</Typography>
                </Box>
                <Box>
                  <Typography variant="caption">Industry P/E</Typography>
                  <Typography variant="h6" sx={{ fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>{data.fundamentals.industry_pe}x</Typography>
                </Box>
                {data.fundamentals.pe < data.fundamentals.industry_pe && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip label="Below industry P/E" size="small" sx={{ bgcolor: 'rgba(76,175,80,0.12)', color: 'success.main', fontWeight: 500 }} />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Setup Detection */}
        <Grid size={{ xs: 12 }}>
          <SectionTitle icon={AutoAwesome}>Setup Detection</SectionTitle>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Which of the 8 setups might explain this move?
          </Typography>
          <Grid container spacing={2}>
            {data.setups.detected.map((s) => (
              <Grid size={{ xs: 12, sm: 6 }} key={s.setup}>
                <SetupCard setup={s} detected />
              </Grid>
            ))}
            {data.setups.not_detected.map((s) => (
              <Grid size={{ xs: 12, sm: 6 }} key={s.setup}>
                <SetupCard setup={s} detected={false} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* AI Summary */}
        <Grid size={{ xs: 12 }}>
          <SectionTitle icon={AutoAwesome}>AI Summary</SectionTitle>
          <Card sx={{ borderColor: 'rgba(79,195,247,0.15)' }}>
            <CardContent>
              <Typography variant="body1" sx={{ lineHeight: 1.7, fontStyle: 'italic', color: 'text.secondary' }}>
                "{data.ai_summary}"
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {data.key_levels && Object.entries(data.key_levels).map(([key, val]) => (
                  <Chip key={key} label={`${key.replace(/_/g, ' ')}: ₹${val}`} size="small" sx={{ fontWeight: 500, bgcolor: 'rgba(255,255,255,0.06)' }} />
                ))}
              </Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                This summary is generated by AI from the data above. It restates facts — it does not give opinions or recommendations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<Bookmark />} onClick={() => handleAction('added to watchlist')}>
          Add to Watchlist
        </Button>
        <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={() => handleAction('added to portfolio')}>
          Add to Portfolio
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<Flag />} onClick={() => handleAction('flagged for later')}>
          Flag for Later
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={() => { handleAction('dismissed'); navigate('/scanner'); }}>
          Dismiss
        </Button>
      </Box>

      {/* Your Judgment reminder */}
      <Card sx={{ mt: 3, bgcolor: 'rgba(255,152,0,0.04)', borderColor: 'rgba(255,152,0,0.15)' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: 'warning.main', mb: 0.5 }}>
            YOUR JUDGMENT ON THIS STOCK
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            Chart pattern — what is it? Is it convincing? &bull; Management quality &bull;
            Is this stock "operated"? &bull; What does your network say? &bull;
            Final conviction: buy or pass?
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function TechRow({ label, value, ok, color, highlight }) {
  let valueColor = color || 'text.primary';
  if (ok === true) valueColor = 'success.main';
  if (ok === false) valueColor = 'text.secondary';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {ok !== undefined && (
          ok ? <CheckCircle sx={{ fontSize: '0.9rem', color: 'success.main' }} /> :
               <Cancel sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.2)' }} />
        )}
        <Typography sx={{ fontWeight: highlight ? 700 : 500, color: valueColor, fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function FundRow({ label, field, quarters, prefix = '', suffix = '', invertColor = false }) {
  const first = quarters[0]?.[field];
  const last = quarters[quarters.length - 1]?.[field];
  const yoy = first && last ? ((first - last) / Math.abs(last) * 100) : null;

  return (
    <TableRow sx={{ '&:last-child td': { border: 0 } }}>
      <TableCell>
        <Typography variant="body2">{label}</Typography>
      </TableCell>
      {quarters.map((q) => (
        <TableCell key={q.label} align="right">
          <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem' }}>
            {prefix}{q[field]}{suffix}
          </Typography>
        </TableCell>
      ))}
      <TableCell align="right">
        {yoy !== null && (
          <ChangeIndicator
            value={invertColor ? -yoy : yoy}
            suffix="%"
            fontSize="0.85rem"
          />
        )}
      </TableCell>
    </TableRow>
  );
}

function SetupCard({ setup, detected }) {
  const sourceConfig = {
    auto: { label: 'AUTO-DETECTED', color: '#4caf50', icon: CheckCircle },
    news: { label: 'FROM NEWS SCAN', color: '#4fc3f7', icon: HelpOutline },
    data: { label: 'FROM DATA', color: '#ff9800', icon: HelpOutline },
    manual: { label: 'MANUAL CHECK', color: 'rgba(255,255,255,0.4)', icon: HelpOutline },
  };
  const config = sourceConfig[setup.source] || sourceConfig.manual;

  return (
    <Card sx={{
      opacity: detected ? 1 : 0.6,
      borderColor: detected ? `${config.color}30` : 'rgba(255,255,255,0.06)',
    }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {detected
            ? <CheckCircle sx={{ fontSize: '1rem', color: 'success.main' }} />
            : <Cancel sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.2)' }} />
          }
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{setup.setup}</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, lineHeight: 1.5 }}>
          {setup.detail}
        </Typography>
        <Chip
          label={config.label}
          size="small"
          sx={{ fontSize: '0.6rem', fontWeight: 600, color: config.color, bgcolor: `${config.color}12`, height: 20 }}
        />
      </CardContent>
    </Card>
  );
}
