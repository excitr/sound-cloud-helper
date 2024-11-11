'use client';

import { Avatar, Typography, Box } from '@mui/material';
import { rem } from '@/theme';

interface MeData {
  id: number;
  username: string;
  followings_count: number;
  followers_count: number;
  avatar_url: string;
}

interface ProfileHeaderProps {
  userInfo?: MeData;
}

export default function ProfileHeader({ userInfo }: ProfileHeaderProps): React.JSX.Element {
  return (
    <Box
      py={10}
      mt={14}
      mx={20}
      display="flex"
      alignItems="center"
      justifyContent="left"
      pl={{ xs: 4, sm: 8, md: 12, lg: 24 }}
      height={{ xs: 'auto', md: '35vh' }}
      borderRadius={8}
      color="#fff"
      sx={{
        backgroundImage: 'url(/bg.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        textAlign: { xs: 'center', sm: 'left' },
      }}
    >
      <Avatar
        src={userInfo?.avatar_url ?? ''}
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
          {userInfo?.username ?? ''}
        </Typography>
        <Typography fontSize={rem(20.8)} fontWeight={400}>
          Follower(s): {userInfo?.followers_count ?? 0}
        </Typography>
        <Typography fontSize={rem(20.8)} fontWeight={400}>
          Following(s):{userInfo?.followings_count ?? 0}
        </Typography>
      </Box>
    </Box>
  );
}
