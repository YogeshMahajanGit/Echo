import { useInputValidation } from '6pp';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, getAdmin } from '../../redux/thunks/authAdmin';
import { useEffect } from 'react';

function AdminLogin() {
  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const secretKey = useInputValidation('');

  function handleSubmitForm(e) {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  }

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;
  return (
    <div
      style={{
        backgroundImage:
          'linear-gradient(rgba(200,200,200,0.5),rgba(120,110,220,0.5))',
      }}
    >
      <Container
        component={'main'}
        maxWidth="xs"
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginx: '10px',
          }}
        >
          <>
            <Typography variant="h5">Admin Login</Typography>
            <form
              onSubmit={handleSubmitForm}
              style={{
                width: '100%',
                marginTop: '1rem',
              }}
            >
              <TextField
                required
                fullWidth
                label="Secret Key"
                type="password"
                margin="normal"
                variant="outlined"
                value={secretKey.value}
                onChange={secretKey.changeHandler}
              />
              <Button
                sx={{ marginTop: '1rem' }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Login
              </Button>
            </form>
          </>
        </Paper>
      </Container>
    </div>
  );
}

export default AdminLogin;
