'use client';
import { Box, Typography } from '@mui/material';
import { rem } from '@/theme';

export default function LogSection(): React.JSX.Element {
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
        {logEntries.map((entry) => (
          <Box key={entry.id} display="flex" flexDirection="row" gap={{ xs: 2, sm: 4, md: 6 }} pb={1}>
            <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
              {entry.date}
            </Typography>
            <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
              {entry.time}
            </Typography>
            <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
              {entry.message}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// Mock log entries data
const logEntries = [
  { id: '1', date: '2024-10-05', time: '05:41:14', message: 'Task follow created' },
  { id: '2', date: '2024-10-05', time: '05:41:14', message: 'Task follow paused' },
  {
    id: '3',
    date: '2024-10-05',
    time: '05:41:14',
    message: 'Task follow successfully scheduled. It starts at: 2024-10-27 11:21:37',
  },
  { id: '4', date: '2024-10-05', time: '05:41:14', message: 'Task follow resumed' },
  { id: '5', date: '2024-10-05', time: '05:41:14', message: 'Task follow created' },
];
