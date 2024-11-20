'use client';
import { Box, Typography } from '@mui/material';
import { rem } from '@/theme';
import { useHomePageContext } from '../context';

export default function LogSection(): React.JSX.Element {
  const { logData } = useHomePageContext();
  return (
    <Box
      mx={{ xs: 0, sm: 2, md: 20, lg: 46 }}
      mb={4}
      px={{ xs: 2, sm: 4, md: 6, lg: 8 }}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography
        mb={4}
        fontSize={{ xs: rem(20), sm: rem(24), md: rem(28.8) }}
        color="#0B0C1B"
        fontWeight={700}
        variant="h6"
      >
        Log
      </Typography>
      <Box
        px={{ xs: 2, sm: 4, md: 5 }}
        py={2}
        borderRadius={4}
        textAlign="left"
        sx={{
          backgroundColor: '#F5F5F5',
        }}
      >
        {logData.map((entry) => (
          <Box key={entry.id} display="flex" flexDirection="row" gap={{ xs: 1, sm: 4, md: 6 }} pb={1}>
            <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
              {entry.startTime instanceof Date ? entry.startTime.toISOString() : (entry.startTime ?? '-')}
            </Typography>

            <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
              Task {entry.activityType}
            </Typography>
            <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
              {entry.isSuccess ? entry.isSuccess : 'UnSccess'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
