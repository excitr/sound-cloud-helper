'use client';

import { z } from 'zod';
import React from 'react';
import { Container, Button, Typography, Box, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { useSearchParams, useRouter } from 'next/navigation';
import { logger } from '@repo/logger/src';
import { toast } from 'react-hot-toast';
import type { FormValues } from '@/app/modules/common/models/login';
import { DEFAULT_HOME_PATH } from '@/middleware';

const SignInResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  error: z.string().optional(),
});

function Page(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFormSubmit = async (values: FormValues): Promise<void> => {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    // Ensure to check the response status before parsing
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = SignInResponseSchema.parse(await response.json()); // This will throw an error if validation fails

    if (!result.success) {
      const errorMessage = typeof result.error === 'string' ? result.error : 'Failed to login';

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    toast.success('Login Successfully');

    const redirectUrl = searchParams.get('redirect');
    router.push(redirectUrl ?? DEFAULT_HOME_PATH);
  };

  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20vh',
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        You must log in to view the page at /web-sch.
      </Typography>

      <Formik<FormValues> initialValues={initialValues} onSubmit={handleFormSubmit}>
        {({ handleBlur, handleSubmit, setFieldValue }) => {
          const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            void setFieldValue('email', e.target.value).catch((err: unknown) => {
              if (err instanceof Error) {
                // Handle the error appropriately if it's an instance of Error
                logger.error('Error setting email:', err.message); // or use logger.error
              } else {
                // Handle unexpected error types
                logger.error('Unexpected error:', err);
              }
            });
          };

          const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            void setFieldValue('password', e.target.value).catch((err: unknown) => {
              if (err instanceof Error) {
                // Handle the error appropriately if it's an instance of Error
                logger.error('Error setting password:', err.message); // or use logger.error
              } else {
                // Handle unexpected error types
                logger.error('Unexpected error:', err);
              }
            });
          };

          return (
            <Form
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  mt: '20px',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <TextField
                    label="Enter your Email address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleEmailChange}
                    sx={{
                      width: '400px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '65px',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ width: '100%' }}>
                  <TextField
                    label="Enter your password"
                    name="password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handlePasswordChange}
                    sx={{
                      width: '400px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '65px',
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Box sx={{ width: '50%' }}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      style={{
                        marginTop: '16px',
                        backgroundColor: '#FF5722',
                        color: '#fff',
                        height: '50px',
                        fontSize: '16px',
                        borderRadius: '65px',
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
}

export default Page;
