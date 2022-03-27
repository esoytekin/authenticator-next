import type { NextPage, NextPageContext } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { logout, setUser } from '../store/app/user.slice';
import { useAppDispatch, useAppSelector } from '../store/hook';
import styles from '../styles/Home.module.css';
import TOTP from '../lib/totp';
import {
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    ContentCopyOutlined,
    LogoutOutlined,
    Add,
    DeleteOutlined,
    EditOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { gql } from '@keystone-6/core';
import {
    deleteSecret,
    getSecrets,
    saveSecret,
    selectAllSecrets,
} from '../store/app/secret.slice';
import DialogAddSecret from '../component/addSecret.dialog';
import SecretModel from '../model/secret.model';

function useCountdownTimer() {
    const [counter, setCounter] = useState(TOTP.getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(TOTP.getTime());
        }, 1000);

        return function () {
            clearInterval(interval);
        };
    }, []);

    return counter;
}

type KeyItem = {
    id: string;
    site: string;
    key: string;
};

type HomePageProps = {
    keys: KeyItem[];
};

const Home: NextPage<HomePageProps> = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.app.user);
    const countDown = useCountdownTimer();
    const router = useRouter();
    const secrets = useAppSelector(selectAllSecrets);

    const { loading, error } = useAppSelector(state => state.app.secret);

    const [addSecretDialogOpen, setAddSecretDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SecretModel | undefined>(
        undefined
    );

    const { data: session } = useSession();

    useEffect(() => {
        dispatch(getSecrets());
    }, [dispatch]);

    useEffect(() => {
        if (session) {
            const { user: sessionUser } = session;
            if (sessionUser?.email && !user.email) {
                dispatch(setUser({ email: sessionUser.email }));
            }
        }
    }, [session, dispatch, user]);

    const handleDeleteClick = (id: string | undefined) => {
        if (!!id) {
            dispatch(deleteSecret(id));
        }
    };

    const handleEditClick = (secret: SecretModel) => {
        setSelectedItem(secret);
        setAddSecretDialogOpen(true);
    };

    const handleSecretSave = (secret: SecretModel) => {
        setAddSecretDialogOpen(false);
        dispatch(saveSecret(secret));
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Authentication App</title>
                <meta name="description" content="Authentication App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className=" flex w-full h-36 bg-black fixed top-0 left-0 p-5 gap-8">
                <h2 className="text-18 min-w-224 text-white">
                    Two Factor Authentication
                </h2>
                <div className="flex-grow-1 w-full text-white">{error}</div>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        setAddSecretDialogOpen(true);
                    }}
                >
                    <Add />
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={async () => {
                        await dispatch(logout());
                        router.replace('/login');
                    }}
                >
                    <LogoutOutlined />
                </Button>
            </div>
            <main className={styles.main}>
                {loading && <h3>Loading</h3>}
                <List className="flex flex-col">
                    {secrets.map(k => (
                        <ListItem key={k.site} className="border-1">
                            <ListItemIcon>
                                <span>{countDown}</span>
                            </ListItemIcon>
                            <ListItemText>
                                <div className="flex grid grid-cols-3 gap-8">
                                    <span>{k.site}</span>
                                    <span>{TOTP.getOTP(k.key)}</span>
                                    <div className="flex gap-8">
                                        <EditOutlined
                                            className="hover:text-lime-400 cursor-pointer"
                                            onClick={handleEditClick.bind(
                                                null,
                                                k
                                            )}
                                        />
                                        <DeleteOutlined
                                            className="hover:text-red-500 cursor-pointer"
                                            onClick={handleDeleteClick.bind(
                                                null,
                                                k.id
                                            )}
                                        />
                                    </div>
                                </div>
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </main>
            <DialogAddSecret
                open={addSecretDialogOpen}
                onClose={() => {
                    setAddSecretDialogOpen(false);
                    setSelectedItem(undefined);
                }}
                onSave={handleSecretSave}
                selected={selectedItem}
            />
        </div>
    );
};

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
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

export default Home;
