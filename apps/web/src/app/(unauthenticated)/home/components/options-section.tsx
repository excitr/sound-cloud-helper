'use client';
import React, { useState } from 'react'; // Explicitly importing React
import { Box, TextField, Typography } from '@mui/material';
import RadioButtonGroup from '@/components/form/mui-radio-button';
import { rem } from '@/theme';

export default function OptionsSection(): React.JSX.Element {
  const [selectedCycleValue, setSelectedCycleValue] = useState<string>(' ');
  const [selectedFollowValue, setSelectedFollowValue] = useState<string>('Follow');
  const [selectedUnfollowValue, setSelectedUnfollowValue] = useState<string>(' ');

  // Handle changes for the radio buttons
  const handleCycleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedCycleValue(event.target.value);
  };

  const handleFollowChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedFollowValue(event.target.value);
  };

  const handleUnfollowChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedUnfollowValue(event.target.value);
  };

  return (
    <Box my={16} ml={54} display="flex" alignItems="start" flexDirection="column">
      <Typography mt={1} color="#0B0C1B" fontWeight={700} fontSize={rem(28.8)}>
        Options
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography mr={4} fontWeight={400} fontSize={rem(20.8)} color="#444">
          Scrape URL:
        </Typography>
        <TextField
          variant="outlined"
          sx={{
            width: '43.75rem',
            '& .MuiOutlinedInput-root': {
              borderRadius: rem(16),
            },
          }}
        />
      </Box>

      {/* Use the RadioButtonGroup component */}
      <Box display="flex" alignItems="center" gap={4}>
        <RadioButtonGroup
          name="cycleGroup"
          selectedValue={selectedCycleValue}
          onChange={handleCycleChange}
          options={[{ value: 'cycle', label: 'Cycle' }]}
        />

        <RadioButtonGroup
          name="cycleGroup"
          selectedValue={selectedCycleValue}
          onChange={handleCycleChange}
          options={[{ value: 'max', label: 'Max' }]}
        />
      </Box>

      <Box display="flex" flexDirection="row" alignItems="start">
        <RadioButtonGroup
          name="followGroup"
          selectedValue={selectedFollowValue}
          onChange={handleFollowChange}
          options={[{ value: 'Follow', label: 'Follow :' }]}
          sx={{ my: 4, ml: 4 }}
        />

        <TextField
          variant="outlined"
          sx={{
            width: '7.75rem',
            '& .MuiOutlinedInput-root': {
              borderRadius: rem(40),
              backgroundColor: '#DDD',
            },
            my: 3,
          }}
        />
      </Box>

      <RadioButtonGroup
        name="followGroup"
        selectedValue={selectedFollowValue}
        onChange={handleFollowChange}
        options={[{ value: 'ProUsers', label: 'Only follow PRO users' }]}
        sx={{ my: 1, ml: 8 }}
      />

      <Box display="flex" flexDirection="row" alignItems="start">
        <RadioButtonGroup
          name="unfollowGroup"
          selectedValue={selectedUnfollowValue}
          onChange={handleUnfollowChange}
          options={[{ value: 'Unfollow', label: 'Unfollow :' }]}
          sx={{ my: 4, ml: 4 }}
        />

        <TextField
          variant="outlined"
          sx={{
            width: '7.75rem',
            '& .MuiOutlinedInput-root': {
              borderRadius: rem(40),
              backgroundColor: '#DDD',
            },
            my: 3,
          }}
        />
      </Box>

      <RadioButtonGroup
        name="unfollowGroup"
        selectedValue={selectedUnfollowValue}
        onChange={handleUnfollowChange}
        options={[{ value: 'UnfollowPassiveFollowings', label: '1st unfollow passive followings' }]}
        sx={{ my: 2, ml: 8 }}
      />

      <RadioButtonGroup
        name="unfollowGroup"
        selectedValue={selectedUnfollowValue}
        onChange={handleUnfollowChange}
        options={[{ value: 'WhitelistManualFollowings', label: 'Whitelist manual followings' }]}
        sx={{ my: 2, ml: 8 }}
      />

      <RadioButtonGroup
        name="ScheduleUnfollowOn"
        selectedValue={selectedUnfollowValue}
        onChange={handleUnfollowChange}
        options={[{ value: 'ScheduleUnfollowOn', label: 'Schedule daily (un)following on:' }]}
        sx={{ my: 4 }}
      />
    </Box>
  );
}
