import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

export default function SignUp() {
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailTakenModal, setShowEmailTakenModal] = useState(false);


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:;"'<>,.?/~`]).{10,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const firstName = data.get('firstName');
      const lastName = data.get('lastName');
      const email = data.get('email');
      const password = data.get('password');

      setEmailError(!validateEmail(email));
      setPasswordError(!validatePassword(password));

      if (!validateEmail(email) || !validatePassword(password)) {
        return;
      }

      const response = await fetch('http://localhost:5000/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Registration successful');
        setShowSuccessModal(true);
      } else if (response.status === 400) {
        console.log('Email is already taken');
      } else {
        console.log('Registration failed:', result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };


  return (
    <Container component="main" maxWidth="sm">
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="off"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                error={emailError}
                helperText={emailError ? 'Please enter a valid email address.' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
                error={passwordError}
                helperText={
                  passwordError
                    ? 'Please enter a password with at least 1 lowercase letter, 1 uppercase letter, 1 special character, and a minimum length of 10 characters.'
                    : ''
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>

          {/* Success Modal */}
          <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
            <DialogTitle>Registration Successful</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Your registration was successful! You can now log in with your new account.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSuccessModal(false)} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Email Taken Modal */}
          <Dialog open={showEmailTakenModal} onClose={() => setShowEmailTakenModal(false)}>
            <DialogTitle>Email Already Taken</DialogTitle>
            <DialogContent>
              <DialogContentText>
                The email address is already taken. Please use a different email address.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEmailTakenModal(false)} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Container>
  );
}