import {
    Avatar,
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { NextPageContext } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const { status } = useSession();
    const router = useRouter();

    const refEmail = useRef<any>(null);
    const refPassword = useRef<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            console.log('pushing');
            router.replace('/');
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = refEmail.current.value;
        const password = refPassword.current.value;
        const response: any = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setError(response.error);
    };

    if (status === 'loading') {
        return <div>Loading</div>;
    }

    if (status === 'authenticated') {
        router.replace('/home');
    }

    return (
        <Grid container component="main" className="h-screen ">
            <Grid
                item
                xs={false}
                sm={false}
                md={9}
                className="hidden md:flex flex-col justify-center items-center bg-cyan-100"
            >
                <Typography variant="h5">Two Factor Authentication</Typography>
            </Grid>
            <Grid
                item
                xs={12}
                sm={12}
                md={3}
                component={Paper}
                elevation={6}
                square
                sx={{
                    backgroundColor: t =>
                        t.palette.mode === 'light'
                            ? t.palette.grey[300]
                            : t.palette.grey[900],
                }}
            >
                <Box className="my-8 mx-20 flex flex-col items-center pt-20">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            inputRef={refEmail}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            inputRef={refPassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        {error && (
                            <Paper className="p-5 text-center">{error}</Paper>
                        )}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);

    console.log('session/getServerSideProps/login', session);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
}

LoginPage.config = {
    showSidebar: false,
    showToolbar: false,
    showFooter: false,
};

export default LoginPage;
