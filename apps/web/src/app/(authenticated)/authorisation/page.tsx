import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import Image from 'next/image';

function SoundCloudAuth(): React.JSX.Element {
  return (
    <Box
      sx={{
        backgroundImage: 'url(/bg.png)', // Your image is now referenced from the public folder
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
            src="/souldCloudlogo.jpg" // Ensure the image is inside the 'public' folder
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
