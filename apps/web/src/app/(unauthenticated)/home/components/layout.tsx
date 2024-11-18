'use client';
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import Image from 'next/image';
import { rem } from '@/theme';
import EmailDropdown from '../helper/email-dropdown';

function Layout(): React.JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleSignOut = (): void => {
    // Sign out logic here
  };

  const userEmail = 'dhz2@ighelper.com'; // TODO selected account display in top header dropdown

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#F4F4F4', color: '#444', py: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={120} // Set width and height
            height={32}
          />
        </Box>

        <Box display="flex" gap={4} alignItems="center" fontWeight={400} textTransform="none">
          {['Main', 'About', 'Prices', 'Support', 'Profile'].map((item) => (
            <Button key={item} color="inherit" sx={{ textTransform: 'none', fontSize: rem(18), fontWeight: '400' }}>
              {item}
            </Button>
          ))}
          <Typography variant="body2" color="text.secondary" fontSize={rem(18)} fontWeight={400}>
            V1.48.1
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <EmailDropdown
            userEmail={userEmail}
            handleMenuClick={handleMenuClick}
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleSignOut={handleSignOut}
          />

          <IconButton size="large" sx={{ color: '#A7FF9F' }}>
            <CircleIcon fontSize="large" />

            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography color="#444" variant="body1">
                +
              </Typography>
            </Box>
          </IconButton>

          <Button
            variant="outlined"
            onClick={handleSignOut}
            sx={{ textTransform: 'none', backgroundColor: '#FF5732', borderRadius: 4, color: '#FFF' }}
          >
            Sign out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Layout;
