'use client';
import React, { useCallback } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { env } from '@/env.mjs';

const clientId = env.NEXT_PUBLIC_CLIENT_ID;
const redirectUri = env.NEXT_PUBLIC_REDIRECT_URL;
const codeChallenge = env.NEXT_PUBLIC_CODE_CHALLENGE;

function SoundCloudAuth(): React.JSX.Element {
  // Generate a random state value for added security
  const state = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const redirectToSoundCloud = useCallback(() => {
    const url = `https://secure.soundcloud.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
    window.location.href = url;
  }, [state]);

  return (
    <Box
      sx={{
        backgroundImage: 'url(/bg.avif)', // Your image is now referenced from the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Translucent card */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)', // Adds the blur effect
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" sx={{ color: '#fff', marginBottom: '16px' }}>
          Authorize at SoundCloud (SC) here in order to link your account.
        </Typography>

        <Button
          variant="contained"
          onClick={redirectToSoundCloud}
          sx={{
            backgroundColor: '#FF5722',
            color: '#fff',
            padding: '12px 24px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            textTransform: 'none',
          }}
        >
          <Image
            src="/souldCloudlogo.svg" // Ensure the image is inside the 'public' folder
            alt="SoundCloud"
            width={24} // Set width and height
            height={24}
            unoptimized
            style={{ marginRight: '8px' }} // You can still apply styling
          />
          <Typography variant="body1" component="span" sx={{ mr: '5px' }}>
            Connect with
          </Typography>
          <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
            SoundCloud
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
export default SoundCloudAuth;
