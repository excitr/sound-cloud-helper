'use client';

import { Avatar, Typography, Box } from '@mui/material';
import { rem } from '@/theme';
import { useHomePageContext } from '../context';

export default function ProfileHeader(): React.JSX.Element {
  const { profileData } = useHomePageContext();

  return (
    <Box
      width="90%"
      py={10}
      ml="5%"
      display="flex"
      alignItems="center"
      justifyContent="left"
      pl={{ xs: 4, sm: 8, md: 12, lg: 24 }}
      height={{ xs: 'auto' }}
      borderRadius={8}
      color="#fff"
      sx={{
        backgroundImage: 'url(/bg.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flexDirection: { xs: 'row' },
        textAlign: { xs: 'center', sm: 'left' },
      }}
    >
      <Avatar
        src={profileData.avatarUrl}
        sx={{
          width: { xs: '6rem', sm: '9rem', md: '13.6rem' },
          height: { xs: '6rem', sm: '9rem', md: '13.6rem' },
          mr: { sm: 4, xs: 0 },
          mb: { xs: 2, sm: 0 },
          border: '0.125rem solid white',
        }}
      />
      <Box>
        <Typography fontWeight={700} pb={6} fontSize={rem(28.8)} variant="h5">
          {profileData.userName}
        </Typography>
        <Typography fontSize={rem(20.8)} fontWeight={400}>
          Follower(s): {profileData.followersCount}
        </Typography>
        <Typography fontSize={rem(20.8)} fontWeight={400}>
          Following(s):{profileData.followingsCount}
        </Typography>
      </Box>
    </Box>
  );
}
