'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  CssBaseline,
  Typography,
  Box,
  Avatar,
  Button,
  CircularProgress,
  Link,
  IconButton,
  Snackbar,
  Grid,
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import { BACKEND_ENDPOINT } from '../../config';
import FormComponent from '../../components/FormComponent';
import AlertComponent from '../../components/AlertComponent';

const defaultTheme = createTheme();

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      (() => {
        fetch(`${BACKEND_ENDPOINT}/auth/verify-auth-token`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (data.success) {            
              window.location.href = '/';
            } else {
              setError(data.message);
              localStorage.removeItem('token');
            }
          })
          .catch((error) => {
            setError('Unable to process your request, please try later.');
          })
          .finally(() => {
            setLoading(false);
          });
      })();
    }

    return function cleanup() {};
  }, []);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setMessage('');
  };

  const onSubmit = (data: any) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    setLoading(true);

    fetch(`${BACKEND_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setOpen(true);
          setMessage('User Logged in successfully.');
          localStorage.setItem('token', data.res.token);
          window.location.href = '/';
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        setError('Unable to process your request, please try later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fields = [
    {
      name: 'email',
      label: 'Email Address',
      autoComplete: 'email',
      rules: {
        required: 'Email is required.',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      },
    },
    {
      name: 'password',
      label: 'Password',
      autoComplete: 'password',
      rules: {
        required: 'Password is required.',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters long.',
        },
        pattern: {
          value: /^(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[0-9])(?=.*[A-Z])/,
          message:
            'Password must contain at least one special character, one numeric character, and one capital letter.',
        },
      },
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              <FormComponent
                fields={fields}
                register={register}
                errors={errors}
              />
              <AlertComponent error={error} setError={setError} />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: '#222222',
                  '&:hover': {
                    color: '#ffffff',
                  },
                }}
              >
                {loading ? <CircularProgress /> : 'Sign In'}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/register" variant="body2">
                    Not have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </main>
  );
};

export default LoginForm;
