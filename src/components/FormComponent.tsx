import React from 'react';
import { Grid, TextField } from '@mui/material';

const FormComponent = ({ fields, register, errors }: {fields: any[]; register: any; errors: any; }) => {
  return (
    <Grid container spacing={2}>
      {fields.map((field, index) => (
        <Grid item xs={12} key={index}>
          <TextField
            required={field.rules.required ? true : false}
            fullWidth
            id={field.name}
            label={field.label}
            type={
              field.name === 'password' || field.name === 'confirmPassword'
                ? 'password'
                : 'text'
            }
            {...register(field.name, field.rules)}
            error={Boolean(errors[field.name])}
            helperText={<>{errors[field.name]?.message}</>}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FormComponent;