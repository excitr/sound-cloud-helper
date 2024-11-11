'use client';
import { Box, Typography } from '@mui/material';
import { rem } from '@/theme';

export default function LogSection(): React.JSX.Element {
  return (
    <Box mb={4} px={54} display="flex" justifyContent="center" flexDirection="column">
      <Typography mb={4} fontSize={rem(28.8)} color="#0B0C1B" fontWeight={700} variant="h6">
        Log
      </Typography>
      <Box
        px={5}
        py={2}
        borderRadius={4}
        textAlign="left"
        sx={{
          backgroundColor: '#F5F5F5',
        }}
      >
        <Box display="flex" flexDirection="row" gap={10} fontSize={rem(12)} pb={1}>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            2024-10-05
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            05:41:14
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            Task follow created
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row" gap={10} fontSize={rem(12)} pb={1}>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            2024-10-05
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            05:41:14
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            Task follow paused
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row" gap={10} fontSize={rem(12)} pb={1}>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            2024-10-05
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            05:41:14
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            Task follow successfully scheduled. It starts at: 2024-10-27 11:21:37
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row" gap={10} fontSize={rem(12)} pb={1}>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            2024-10-05
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            05:41:14
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            Task follow resumed
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row" gap={10} fontSize={rem(12)} pb={1}>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            2024-10-05
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            05:41:14
          </Typography>
          <Typography fontWeight={400} color="#777" fontSize={rem(12)} variant="body2">
            Task follow created
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
