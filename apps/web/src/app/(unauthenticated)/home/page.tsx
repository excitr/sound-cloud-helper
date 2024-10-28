'use client';
import React from 'react';
import { Button, Typography, Box } from '@mui/material';

function Page(): React.JSX.Element {
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
          <Typography variant="body1" component="span" sx={{ mr: '5px' }}>
            Home Page
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default Page;
