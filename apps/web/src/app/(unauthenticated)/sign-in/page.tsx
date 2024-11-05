'use client';

import { z } from 'zod';
import React, { useState, useContext } from 'react';
import { Container, Button, Typography, Box, TextField, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { logger } from '@repo/logger';
import { toast } from 'react-hot-toast';
import { DEFAULT_HOME_PATH } from '@/middleware';
import { SignInSchema, type SignInSchemaType } from '@/utils/schemas/login-schemas';
import { UserContext } from '@/context/user-context';

const SignInResponseSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  error: z.string().optional(),
});

function Page(): React.JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { updateUserFromToken } = useContext(UserContext) ?? {};

  const handleFormSubmit = async (values: SignInSchemaType): Promise<void> => {
    setLoading(true);
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    // Ensure to check the response status before parsing
    if (!response.ok) {
      setLoading(false);
      throw new Error('Network response was not ok');
    }

    const result = SignInResponseSchema.parse(await response.json()); // This will throw an error if validation fails
    logger.info(result, 'result');
    if (!result.success) {
      setLoading(false);
      const errorMessage = typeof result.error === 'string' ? result.error : 'Incorrect credentials';

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    setLoading(false);

    if (result.id && updateUserFromToken) {
      updateUserFromToken(result.id);
    }

    toast.success('Login Successfully');

    router.push(DEFAULT_HOME_PATH);
  };

  const initialValues: SignInSchemaType = {
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

      <Formik<SignInSchemaType>
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validate={(values) => {
          const result = SignInSchema.safeParse(values);
          if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
              if (err.path.length > 0) {
                errors[err.path[0]] = err.message;
              }
            });
            return errors;
          }
          return {};
        }}
      >
        {({ handleBlur, handleSubmit, setFieldValue, errors, touched }) => {
          const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            void setFieldValue('email', e.target.value).catch((err: unknown) => {
              if (err instanceof Error) {
                logger.error('Error setting email:', err.message);
              } else {
                // Handle unexpected error types
                logger.error('Unexpected error:', err);
              }
            });
          };

          const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            void setFieldValue('password', e.target.value).catch((err: unknown) => {
              if (err instanceof Error) {
                logger.error('Error setting password:', err.message);
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
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email ? errors.email : null}
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
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password ? errors.password : null}
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
                      disabled={loading}
                      style={{
                        marginTop: '16px',
                        backgroundColor: loading ? '#ccc' : '#FF5722',
                        color: '#fff',
                        height: '50px',
                        fontSize: '16px',
                        borderRadius: '65px',
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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
