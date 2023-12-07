import React from 'react';
import { Alert } from '@mui/material';

const AlertComponent = ({
  error,
  setError,
}: {
  error: string;
  setError: Function;
}) => {
  return error && error.length ? (
    <Alert
      sx={{ mt: 3 }}
      variant="outlined"
      severity="error"
      onClose={() => {
        setError('');
      }}
    >
      {error}
    </Alert>
  ) : null;
};

export default AlertComponent;
