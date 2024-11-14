'use client';

import React from 'react'; // Explicitly importing React
import { Box, TextField, Typography } from '@mui/material';
import RadioButtonGroup from '@/components/form/mui-radio-button';
import { rem } from '@/theme';
import { useHomePageContext } from '../context';

export default function OptionsSection(): React.JSX.Element {
  const { setOptions, options, activity } = useHomePageContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [event.target.name]: event.target.value,
    }));
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
          name="scrap_url"
          value={options.scrap_url}
          onChange={handleChange}
          variant="outlined"
          disabled={activity}
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
        <RadioButtonGroup name="cycleGroup" options={[{ value: 'cycle', label: 'Cycle' }]} disabled />

        <RadioButtonGroup name="cycleGroup" options={[{ value: 'max', label: 'Max' }]} disabled />
      </Box>

      <Box display="flex" flexDirection="row" alignItems="start">
        <RadioButtonGroup
          name="follow"
          selectedValue={options.follow}
          onChange={handleChange}
          options={[{ value: 'follow', label: 'Follow :' }]}
          sx={{ my: 4, ml: 4 }}
          disabled={activity}
        />

        <TextField
          variant="outlined"
          name="follow_count"
          disabled={activity}
          onChange={handleChange}
          value={options.follow_count}
          type="number"
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
        selectedValue={options.pro_follow}
        onChange={handleChange}
        options={[{ value: 'ProUsers', label: 'Only follow PRO users' }]}
        sx={{ my: 1, ml: 8 }}
        disabled
      />

      <Box display="flex" flexDirection="row" alignItems="start">
        <RadioButtonGroup
          name="unfollowGroup"
          options={[{ value: 'Unfollow', label: 'Unfollow :' }]}
          sx={{ my: 4, ml: 4 }}
          disabled
        />

        <TextField
          variant="outlined"
          onChange={handleChange}
          type="number"
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
        options={[{ value: 'UnfollowPassiveFollowings', label: '1st unfollow passive followings' }]}
        sx={{ my: 2, ml: 8 }}
        disabled
      />

      <RadioButtonGroup
        name="unfollowGroup"
        options={[{ value: 'WhitelistManualFollowings', label: 'Whitelist manual followings' }]}
        sx={{ my: 2, ml: 8 }}
        disabled
      />

      <RadioButtonGroup
        name="ScheduleUnfollowOn"
        options={[{ value: 'ScheduleUnfollowOn', label: 'Schedule daily (un)following on:' }]}
        sx={{ my: 4 }}
        disabled
      />
    </Box>
  );
}
