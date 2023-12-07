'use client';

import { useEffect, useState } from 'react';

import { Person as PersonIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import { BACKEND_ENDPOINT } from '@/config';
import AlertComponent from '@/components/AlertComponent';
const defaultTheme = createTheme();

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
    }

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
              setUser(data.res);
              console.log(data);
            } else {
              setError(data.message);
              localStorage.removeItem('token');
              window.location.href = '/login';
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



  const handleLogout = (event: any) => {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (loading) {
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <CircularProgress />
    </main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: 'secondary.main', height: 100, width: 100 }}
            >
              <PersonIcon sx={{ height: 80, width: 80 }} />
            </Avatar>

            <Box sx={{ mt: 3 }}>
              <AlertComponent error={error} setError={setError} />

              {Object.keys(user).length ? (
                <>
                  <h1 className="mt-4 md:mt-6 font-bold text-3xl md:text-5xl tracking-tight mb-2 text-black">
                    {user.username}
                  </h1>
                  <p className="mt-6 text-base md:text-lg leading-6 md:leading-8 text-gray-600 text-center max-w-sm">
                    {user.email}
                  </p>
                  <Button
                  onClick={handleLogout}
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
                    Sign Out
                  </Button>
                </>
              ) : null}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </main>
  );
}
