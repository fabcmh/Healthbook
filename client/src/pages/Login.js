import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { Button, Alert, AlertTitle, Grid } from '@mui/material';


const defaultTheme = createTheme();

export default function Login() {
  let navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    console.log({ email, password });

    if (email !== '' && password !== '') {
      try {
        const response = await fetch(`http://localhost:5000/user/email=${email}`);
        const user = await response.json();

        if (!user) {
          console.log("No entry found");
        } else {
          console.log("Entry found");

          // Check if credentials are correct
          const isCredentialsCorrect =
            email === user.email && password === user.password;

          if (isCredentialsCorrect) {
            sessionStorage.setItem("loggedIn", true);
            sessionStorage.setItem("email", email);
            setShowAlert(false);
            navigate("/Home");
          } else {
            setShowAlert(true);
            console.log("Incorrect credentials");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/Polyclinc.jpg)`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h2" component="h1" align="center">
              Healthbook
            </Typography>
            <Box />
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="off"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
              />
              {
                showAlert && (<Alert severity="error">
                  <AlertTitle><strong>Error</strong></AlertTitle>
                  Email or password is wrong, please try again.
                </Alert>
                )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="SignUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}